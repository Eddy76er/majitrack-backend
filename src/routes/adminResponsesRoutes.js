// routes/adminResponsesRoutes.js
const express = require('express');
const router = express.Router();
const validateUUID = require('../middlewares/validateUUID');
const adminResponsesController = require('../controllers/adminResponsesController');

// POST: Send a response to a report
router.post('/', adminResponsesController.sendResponse);

// GET: View a specific response by report_id
router.get('/:reportId', validateUUID('reportId'), adminResponsesController.getResponseByReportId);

module.exports = router;
