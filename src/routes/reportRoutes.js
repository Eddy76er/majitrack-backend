const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticateToken, requireResident } = require('../middlewares/auth');
const validateUUID = require('../middlewares/validateUUID')

// ✅ Use Cloudinary-based multer config
const upload = require('../config/multerConfig');

/**
 * @route POST /api/reports
 * @desc Submit a new report (Residents only, image optional)
 * @access Protected (Resident)
 */
router.post(
  '/',
  authenticateToken,
  requireResident,
  upload.single('image'),
  reportController.submitReport
);

/**
 * @route GET /api/reports
 * @desc Get all reports (Any logged-in user)
 * @access Protected
 */
router.get('/', authenticateToken, reportController.getAllReports);

/**
 * @route GET /api/reports/user/:userId
 * @desc Get all reports submitted by a specific user
 * @param {string} userId.path.required - UUID of the user
 * @access Protected
 */
router.get(
  '/user/:userId',
  authenticateToken,
  validateUUID('userId'),
  reportController.getUserReports
);

module.exports = router;
