const jwt = require('jsonwebtoken');
require('dotenv')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: "Unauthorized access!"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(`Error verifying JWT: ${err}`);
        return res.status(403).json({message: 'Invalid token!'});
    }
};