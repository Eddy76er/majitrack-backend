const express = require('express');
const router = express.Router();
const adminResponsesController = require('../controllers/adminResponsesController');

// POST /api/admin/responses
router.post('/', adminResponsesController.createResponse);

module.exports = router;
