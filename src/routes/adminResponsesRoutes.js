const express = require('express');
const router = express.Router();
const adminResponsesController = require('../controllers/adminResponsesController');

router.post('/', adminResponsesController.createResponse);

module.exports = router;
