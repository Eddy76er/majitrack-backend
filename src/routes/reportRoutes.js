const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const authenticateToken = require('../middlewares/authenticateToken');
const { requireResident } = require('../middlewares/auth');

// Only residents can submit reports
router.post('/', authenticateToken, requireResident, reportController.submitReport);

// Any authenticated user can view reports
router.get('/', authenticateToken, reportController.getAllReports);

// ✅ Add this line to fix the crash
module.exports = router;
