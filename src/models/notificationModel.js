const db = require('../config/db');

// Create a notification/
const createNotification = async ({ user_id, report_id, message, status }) => {
  const result = await db.query(
    `INSERT INTO notifications 
     (notification_id, user_id, report_id, message, status, date_received)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [uuidv4(), user_id, report_id, message, status, new Date()]
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
