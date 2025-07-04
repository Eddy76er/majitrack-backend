/**
 * Middleware to restrict route to admin users only
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

/**
 * Middleware to restrict route to resident users only
 */
const requireResident = (req, res, next) => {
  if (!req.user || req.user.role !== 'resident') {
    return res.status(403).json({ message: 'Access denied. Residents only.' });
  }
  next();
};

module.exports = {
  requireAdmin,
  requireResident,
};

