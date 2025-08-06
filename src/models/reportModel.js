const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ✅ Create a report
const createReport = async ({ userId, description, status, name, phone_number, imageUrl, water_source_id, water_source_type, date_created }) => {
  const report_id = uuidv4();
  const result = await db.query(
    `INSERT INTO reports (
      report_id, user_id, description, status, name, phone_number,
      image_path, water_source_id, water_source_type, date_created
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      report_id,
      userId,
      description,
      status,
      name,
      phone_number,
      imageUrl,
      water_source_id,
      water_source_type,
      date_created
    ]
  );

  // Get the location from water_sources
  const locationRes = await db.query(
    `SELECT location FROM water_sources WHERE water_source_id = $1`,
    [water_source_id]
  );

  const report = result.rows[0];
  report.location = locationRes.rows[0]?.location || null;

  return report;
};

// ✅ Get all reports with location (for admin)
const getAllReports = async () => {
  const result = await db.query(`
    SELECT r.*, ws.location
    FROM reports r
    LEFT JOIN water_sources ws ON r.water_source_id = ws.water_source_id
    ORDER BY r.date_created DESC
  `);
  return result.rows;
};

// ✅ Get reports by user with location
const getReportsByUser = async (userId) => {
  const result = await db.query(`
    SELECT r.*, ws.location
    FROM reports r
    LEFT JOIN water_sources ws ON r.water_source_id = ws.water_source_id
    WHERE r.user_id = $1
    ORDER BY r.date_created DESC
  `, [userId]);
  return result.rows;
};

module.exports = {
  createReport,
  getAllReports,
  getReportsByUser
};
