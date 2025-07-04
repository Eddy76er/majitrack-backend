const db = require('../config/db');

// Submit a new report
const createReport = async (userId, waterSourceId, description) => {
  const result = await db.query(
    `INSERT INTO reports (user_id, water_source_id, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, waterSourceId, description]
  );
  return result.rows[0];
};

// Get all reports
const getAllReports = async () => {
  const result = await db.query('SELECT * FROM reports ORDER BY date_created DESC');
  return result.rows;
};

// Get reports by user
const getReportsByUser = async (userId) => {
  const result = await db.query(
    'SELECT * FROM reports WHERE user_id = $1 ORDER BY date_created DESC',
    [userId]
  );
  return result.rows;
};

module.exports = {
  createReport,
  getAllReports,
  getReportsByUser,
};
