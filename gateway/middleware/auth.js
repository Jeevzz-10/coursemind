const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_123';

module.exports = function(req, res, next) {
    //get the token from header(client sents it like: "x-auth-token: <TOKEN_HERE>")
    const token = req.header('x-auth-token');
    //check if token exists
    if(!token) {
        return res.status(401).json({message: 'No token, auth denied'});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; //add the user info to request obj
        next(); // authentication done.let the user pass to next step
    }
    catch(err) {
        res.status(401).json({message: 'Token is not valid'});
    }
};