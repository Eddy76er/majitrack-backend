const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const createNotification = async ({ user_id, report_id, message, status }) => {
  const notification_id = uuidv4();
  const result = await db.query(
    `INSERT INTO notifications (notification_id, user_id, report_id, message, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [notification_id, user_id, report_id, message, status]
  );
  return result.rows[0];
};

module.exports = { createNotification };
