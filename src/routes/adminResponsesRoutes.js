const express = require('express');
const router = express.Router();
const validateUUID = require('../middleware/validateUUID');
const adminResponsesController = require('../controllers/adminResponsesController');

// Send a response (report_id is validated)
router.post('/', adminResponsesController.sendResponse);

// View response by report_id
router.get('/:reportId', validateUUID('reportId'), adminResponsesController.getResponseByReportId);

module.exports = router;
