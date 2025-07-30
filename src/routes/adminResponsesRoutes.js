const express = require('express');
const router = express.Router();
const { sendAdminResponse } = require('../controllers/adminResponsesController');

// @route   POST /api/admin-responses
// @desc    Admin sends a response to a report
// @access  Admin only
router.post('/', sendAdminResponse);

module.exports = router;

