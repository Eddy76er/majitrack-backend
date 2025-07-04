const db = require('../config/db');

// Admin responds to a report
const createAdminResponse = async (reportId, adminUserId, comments) => {
  const result = await db.query(
    `INSERT INTO admin_responses (report_id, user_id, comments)
     VALUES ($1, $2, $3) RETURNING *`,
    [reportId, adminUserId, comments]
  );
  return result.rows[0];
};

// Get response by report ID
const getResponseByReport = async (reportId) => {
  const result = await db.query(
    'SELECT * FROM admin_responses WHERE report_id = $1',
    [reportId]
  );
  return result.rows[0];
};

module.exports = {
  createAdminResponse,
  getResponseByReport,
};
