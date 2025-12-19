const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No authentication token, access denied' 
            });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decoded.userId || decoded.id;
        
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }
        
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

module.exports = auth;