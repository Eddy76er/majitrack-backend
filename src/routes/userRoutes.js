const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ POST /api/users/signup - register a new user (admin or resident)
router.post('/signup', userController.registerUser);

// ✅ GET /api/users - get all users (optional: for admin use)
router.get('/', userController.getUsers);

module.exports = router;
