const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticateToken, requireResident } = require('../middlewares/auth');

// ✅ Use Cloudinary-based multer config
const upload = require('../config/multerConfig');

// ✅ Submit a new report (Residents only, image optional)
router.post(
  '/',
  authenticateToken,
  requireResident,
  upload.single('image'), // Cloudinary handles the storage
  reportController.submitReport
);

// ✅ Get all reports (Any logged-in user)
router.get('/', authenticateToken, reportController.getAllReports);

// ✅ Get all reports submitted by a specific user
router.get('/user/:userId', authenticateToken, reportController.getUserReports);

module.exports = router;
