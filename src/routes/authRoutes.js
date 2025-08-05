const express = require('express');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post(
  '/login',
  [
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.login
);

module.exports = router;
