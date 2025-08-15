const express = require('express');
const router = express.Router();
const validateUUID = require('../middlewares/validateUUID');
const userController = require('../controllers/userController');

/**
 * @route   POST /api/users/signup
 * @desc    Create a new user
 * @access  Public
 */
router.post('/signup', userController.signup);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', userController.login);

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID
 * @access  Public or Protected (depending on auth)
 */
router.get('/:id', validateUUID('id'), userController.getUserById);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Protected
 */
router.delete('/:id', validateUUID('id'), userController.deleteUserById);

module.exports = router;
