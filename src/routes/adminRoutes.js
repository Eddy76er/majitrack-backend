const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authenticateToken');
const { requireAdmin } = require('../middlewares/auth');

router.post('/respond/:reportId', authenticateToken, requireAdmin, adminController.respondToReport);

router.get('/response/:reportId', authenticateToken, requireAdmin, adminController.getResponse);

// ✅ Fix: export the router
module.exports = router;
