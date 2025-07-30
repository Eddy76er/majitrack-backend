const db = require('../config/db');

const createAdminResponse = async ({ report_id, comments, status }) => {
  try {
    const reportData = await db.query(
      'SELECT user_id FROM reports WHERE report_id = $1',
      [report_id]
    );

    if (reportData.rows.length === 0) {
      throw new Error('Report not found.');
    }

    const { user_id } = reportData.rows[0];
    const date_sent = new Date();

    const response = await db.query(
      `INSERT INTO admin_responses (report_id, user_id, comments, status, date_sent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [report_id, user_id, comments, status, date_sent]
    );

    await db.query(
      `UPDATE reports SET status = $1 WHERE report_id = $2`,
      [status, report_id]
    );

    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAdminResponse,
};
