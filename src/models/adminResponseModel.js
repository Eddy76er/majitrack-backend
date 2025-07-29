const db = require('../config/db');

const createAdminResponse = async ({ report_id, comments, status }) => {
  try {
    // Get user_id and water_source_id from the reports table
    const reportData = await db.query(
      'SELECT user_id, water_source_id FROM reports WHERE report_id = $1',
      [report_id]
    );

    if (reportData.rows.length === 0) {
      throw new Error('Report not found.');
    }

    const { user_id, water_source_id } = reportData.rows[0];
    const date_sent = new Date();

    const response = await db.query(
      `INSERT INTO admin_responses (report_id, user_id, comments, status, date_sent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [report_id, user_id, comments, status, date_sent]
    );

    // Also update the status of the report to prevent re-resolving
    await db.query(
      `UPDATE reports SET status = $1 WHERE report_id = $2`,
      ['resolved', report_id]
    );

    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAdminResponse,
};
