const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticateToken, requireResident } = require('../middlewares/auth');

const multer = require('multer');
const path = require('path');

// ✅ Configure multer for image upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Route: Submit report (Resident only + optional image)
router.post(
  '/',
  authenticateToken,
  requireResident,
  upload.single('image'),
  reportController.submitReport
);

// ✅ Route: View all reports (any logged-in user)
router.get('/', authenticateToken, reportController.getAllReports);

// ✅ Route: View reports by user (optional, for resident "My Reports" page)
router.get('/user/:userId', authenticateToken, reportController.getUserReports);

module.exports = router;
