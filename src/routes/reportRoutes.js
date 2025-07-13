const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticateToken, requireResident } = require('../middlewares/auth');

const multer = require('multer');
const path = require('path');

// ✅ Configure multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Submit a new report (Residents only, image optional)
router.post(
  '/',
  authenticateToken,
  requireResident,
  upload.single('image'),
  reportController.submitReport
);

// ✅ Get all reports (Any logged-in user)
router.get('/', authenticateToken, reportController.getAllReports);

// ✅ Get all reports submitted by a specific user
router.get('/user/:userId', authenticateToken, reportController.getUserReports);

module.exports = router;
