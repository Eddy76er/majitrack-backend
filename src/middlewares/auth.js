const jwt = require('jsonwebtoken');
const { validate: isUuid } = require('uuid');
require('dotenv').config();

/**
 * Middleware to authenticate and verify JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token missing or unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Validate UUID for userId
    if (!decoded.userId || !isUuid(decoded.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    req.user = decoded; // { userId, role, name }
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to restrict access to admin users only
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

/**
 * Middleware to restrict access to resident users only
 */
const requireResident = (req, res, next) => {
  if (!req.user || req.user.role !== 'resident') {
    return res.status(403).json({ message: 'Access denied. Residents only.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireResident
};
