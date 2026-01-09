const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
// We don't need http-proxy-middleware anymore for this specific route
// const { createProxyMiddleware } = require('http-proxy-middleware'); 
const axios = require('axios'); // <--- NEW: We use this to talk to Python manually
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const auth = require('./middleware/auth');

const app = express();

const PORT = process.env.PORT || 3000;
const PYTHON_SERVICE_URL = process.env.PYTHON_URL || 'http://127.0.0.1:8000';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_123';
const DB_USER = process.env.MONGO_USER;
const DB_PASS = process.env.MONGO_PASSWORD;
const DB_NAME = process.env.MONGO_DB;

if(!DB_USER || !DB_PASS){
    console.error("Error: MONGO_USER and MONGO_PASSWORD missing in .env file");
    process.exit(1);
}

const MONGO_URI = `mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}?authSource=admin`;

// Security and Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
mongoose.connect(MONGO_URI)
    .then(() => console.log('Gateway connected to MongoDB'))
    .catch(err => console.error('DB connection Error:', err.message));

// Health Check
app.get('/health', (req, res) => {
    res.json({
        service: 'API Gateway',
        status: 'Active',
        timestamp: new Date()
    });
});

// Auth Routes
app.post('/auth/register', async (req, res) => {
    try{
        const{username, password} = req.body;
        if (!username || !password){
            return res.status(400).json({error: 'Username and password are required'});
        }
        const UserExists = await User.findOne({username});
        if(UserExists){
            return res.status(400).json({error: 'User already exists'});
        }
        const user = await User.create({username, password});
        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id
        });
    }
    catch (error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({error: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(400).json({error: 'Invalid password credentials' });
        }
        const token = jwt.sign({id: user._id }, JWT_SECRET, {
            expiresIn: '1h'
        });
        res.json({
            message: 'Login successful',
            token: token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

// GET PROFILE
app.get('/auth/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE INTERESTS
app.put('/auth/interests', auth, async (req, res) => {
    try {
        const { interests } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.interests = interests;
        await user.save();

        res.json({ message: 'Interests updated', interests: user.interests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =========================================================
//  NEW: SMART RECOMMENDATION ROUTE (Replaces Old Proxy)
// =========================================================
app.get('/api/recommend', auth, async (req, res) => {
    try {
        // 1. Get the User from DB to see what they like
        const user = await User.findById(req.user.id);
        
        // Convert ["ai", "python"] -> "ai python"
        // If interests is empty/undefined, default to empty string
        const userInterests = (user.interests || []).join(' '); 

        // 2. Get what they typed in the search bar
        const userQuery = req.query.q || '';

        // 3. Log it (So you can see it working in the terminal!)
        console.log(`------------------------------------------------`);
        console.log(`User:      ${user.username}`);
        console.log(`Query:     "${userQuery}"`);
        console.log(`Interests: "${userInterests}"`);
        console.log(`Action:    Sending combined data to Python...`);

        // 4. Send BOTH to Python using Axios
        // We act as the middleman. We ask Python: "Give me results for (Query + Interests)"
        const pythonRes = await axios.get(`${PYTHON_SERVICE_URL}/recommend`, {
            params: {
                q: userQuery,
                interests: userInterests
            }
        });

        // 5. Send Python's answer back to the React Frontend
        res.json(pythonRes.data);

    } catch (err) {
        console.error("Error connecting to Python Service:", err.message);
        res.status(500).json({ error: 'Error connecting to AI Service' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
});