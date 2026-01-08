const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
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
    console.error("Error:MONGO_USER and MONGO_PASSWORD mising in .env file");
    process.exit(1);
}
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}?authSource=admin`;

//security and middleware
app.use(cors());
app.use(express.json());

//connect to database
mongoose.connect(MONGO_URI)
    .then(() => console.log('Gateway connected to MongoDB'))
    .catch(err => console.error('DB connection Error:', err.message));

    //health check
app.get('/health', (req, res) => {
    res.json({
        service: 'API Gateway',
        status: 'Actice',
        timestamp: new Date()
    });
});

//creates users and chekcs authentications
app.post('/auth/register', async (req, res) => {
    try{
        const{username, password} = req.body;
        //validation
        if (!username || !password){
            return res.status(400).json({error: 'Username and password are required'});
        }
        //check if user exists
        const UserExists = await User.findOne({username});
        if(UserExists){
            return res.status(400).json({error: 'User already exists'});
        }
        //create new user
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

//login endpoint : creates JWT tokens to logged in users
app.post('/auth/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        //find user
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({error: 'Invalid credentials' });
        }
        //check password
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(400).json({error: 'Invalid password credentials' });
        }
        //generate token (pack user id inside token to know in future)
        const token = jwt.sign({id: user._id }, JWT_SECRET, {
            expiresIn: '1h' //Token expires in 1hour
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

//proxy logic(connects node->python)
app.use('/api', auth, createProxyMiddleware({
    target: PYTHON_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/recommend': '',
    },
    onError: (err, req, res) => {
        console.error('Proxy Error', err);
        res.status(500).json({message: 'Recommendation Service is unavailable.'});
    }
}));

//start the server
app.listen(PORT, () => {
    console.log(`Gateway running on http://loaclhost:${PORT}`);
    console.log(`Proxying /api/recommend -> ${PYTHON_SERVICE_URL}`);
});