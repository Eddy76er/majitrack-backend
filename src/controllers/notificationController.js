const notificationModel = require('../models/notificationModel');

// POST /api/notifications
const sendNotification = async (req, res) => {
  try {
    const { user_id, report_id, message, status } = req.body;

    if (!user_id || !report_id || !message || !status) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const date_received = new Date();

    await notificationModel.createNotification({
      user_id,
      report_id,
      message,
      status,
      date_received
    });

    res.status(201).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('❌ Notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

// GET /api/notifications/:userId
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationModel.getNotificationsByUser(userId);
    res.json(notifications);
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications
};

