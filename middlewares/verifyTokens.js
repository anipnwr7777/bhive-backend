const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
