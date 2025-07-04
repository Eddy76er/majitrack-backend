const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users - register a new user
router.post('/', userController.registerUser);

// GET /api/users - get all users
router.get('/', userController.getUsers);

module.exports = router;
