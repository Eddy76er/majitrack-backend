const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const { sendResponse } = require('../controllers/adminResponsesController');

router.post(
  '/',
  [
    body('report_id').notEmpty().isString().withMessage('Invalid report ID'),
    body('comments').notEmpty().isString().withMessage('Comments required'),
    body('status').notEmpty().isIn(['pending', 'resolved', 'rejected'])
  ],
  authenticate,
  isAdmin,
  sendResponse
);

module.exports = router;
