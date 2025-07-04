const db = require('../config/db');

// Create a notification
const createNotification = async (userId, reportId, message) => {
  const result = await db.query(
    `INSERT INTO notifications (user_id, report_id, message)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, reportId, message]
  );
  return result.rows[0];
};

// Get notifications by user
const getNotificationsByUser = async (userId) => {
  const result = await db.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY date_received DESC',
    [userId]
  );
  return result.rows;
};

module.exports = {
  createNotification,
  getNotificationsByUser,
};
