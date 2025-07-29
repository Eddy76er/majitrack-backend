const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createResponse = async ({ report_id, user_id, comments, status }) => {
  const response_id = uuidv4();
  const date_sent = new Date();

  const query = `
    INSERT INTO admin_responses (response_id, report_id, user_id, comments, status, date_sent)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [response_id, report_id, user_id, comments, status, date_sent];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getAllResponses = async () => {
  const { rows } = await db.query(`
    SELECT * FROM admin_responses
    ORDER BY date_sent DESC;
  `);
  return rows;
};

module.exports = {
  createResponse,
  getAllResponses,
};
