// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token in Authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
};

module.exports = protect;
