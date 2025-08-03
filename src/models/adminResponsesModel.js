const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const sendResponse = async ({ report_id, user_id, comments, status = 'resolved' }) => {
  const response_id = uuidv4();
  const result = await db.query(
    `INSERT INTO admin_responses (response_id, report_id, user_id, comments, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [response_id, report_id, user_id, comments, status]
  );
  return result.rows[0];
};

module.exports = { sendResponse };
