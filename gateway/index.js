const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
const PYTHON_SERVICE_URL = process.env.PYTHON_URL || 'http://127.0.0.1:8000';

//security and middleware
app.use(cors());
app.use(express.json());
//health check
app.get('/health', (req, res) => {
    res.json({
        service: 'API Gateway',
        status: 'Actice',
        timestamp: new Date()
    });
});
//proxy logic(connects node->python)
app.use('/api', createProxyMiddleware({
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