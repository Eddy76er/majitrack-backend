const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const validateUUID = require('../middlewares/validateUUID')

/**
 * @route POST /api/notifications
 * @desc Send a notification
 * @access Public or Protected (depending on your design)
 */
router.post('/', notificationController.sendNotification);

/**
 * @route GET /api/notifications/user/:userId
 * @desc Get notifications for a user by UUID
 * @access Public or Protected
 * @param {string} userId.path.required - UUID of the user
 */
router.get('/user/:userId', validateUUID('userId'), notificationController.getUserNotifications);

module.exports = router;
