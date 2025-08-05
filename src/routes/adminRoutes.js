const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authenticateToken');
const { requireAdmin } = require('../middlewares/auth');

// Middleware to validate UUID format for reportId
function validateUUID(req, res, next) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const { reportId } = req.params;

  if (!uuidRegex.test(reportId)) {
    return res.status(400).json({ error: 'Invalid UUID format for reportId' });
  }

  next();
}

/**
 * @route POST /admin/respond/:reportId
 * @desc Admin submits response to a report
 * @access Private (Admin only)
 * @param {string} reportId.path.required - Report ID to respond to
 * @body {string} comments - Admin response comments
 * @returns {object} 200 - Response object
 * @returns {Error} 400 - Missing required fields
 * @returns {Error} 403 - Forbidden (not admin)
 * @returns {Error} 404 - Report not found
 * @returns {Error} 500 - Server error
 */
router.post(
  '/respond/:reportId',
  authenticateToken,
  requireAdmin,
  validateUUID,
  adminController.respondToReport
);

/**
 * @route GET /admin/response/:reportId
 * @desc Get admin response for a report
 * @access Private (Admin only)
 * @param {string} reportId.path.required - Report ID to fetch response for
 * @returns {object} 200 - Response object
 * @returns {Error} 403 - Forbidden (not admin)
 * @returns {Error} 404 - Response not found
 * @returns {Error} 500 - Server error
 */
router.get(
  '/response/:reportId',
  authenticateToken,
  requireAdmin,
  validateUUID,
  adminController.getResponse
);

module.exports = router;
