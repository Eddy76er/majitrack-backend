const express = require('express');
const router = express.Router();
const { sendResponse } = require('../controllers/adminResponsesController');  // 👈 Changed to sendResponse
router.post('/', sendResponse);

module.exports = router;