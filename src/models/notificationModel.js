// notificationModel.js

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createNotification = async ({ user_id, report_id, message, status, date_received }) => {
  const notification_id = uuidv4();

  await db.query(
    `INSERT INTO notifications (notification_id, user_id, report_id, message, status, date_received)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [notification_id, user_id, report_id, message, status, date_received]
  );
};

const getNotificationsByUser = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY date_received DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = {
  createNotification,
  getNotificationsByUser
};
