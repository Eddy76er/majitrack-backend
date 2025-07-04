const notificationModel = require('../models/notificationModel');

const sendNotification = async (req, res) => {
  try {
    const { userId, reportId, message } = req.body;
    const notification = await notificationModel.createNotification(userId, reportId, message);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationModel.getNotificationsByUser(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
};
