const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /api/notifications - send a notification
router.post('/', notificationController.sendNotification);

// GET /api/notifications/user/:userId - get notifications for a user
router.get('/user/:userId', notificationController.getUserNotifications);

module.exports = router;
