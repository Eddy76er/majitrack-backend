const db = require('../config/db');

// ✅ Submit a new report (using water_source_id and Cloudinary image URL)
const createReport = async ({
  userId,
  name,
  phone_number,
  water_source_id,
  water_source_type,
  description,
  status,
  date_created,
  imageUrl // Cloudinary image URL
}) => {
  const result = await db.query(
    `INSERT INTO reports (
      user_id,
      name,
      phone_number,
      water_source_id,
      water_source_type,
      description,
      status,
      date_created,
      image_path
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      userId,
      name,
      phone_number,
      water_source_id,
      water_source_type,
      description,
      status,
      date_created,
      imageUrl
    ]
  );

  return result.rows[0];
};

// ✅ Get all reports (for admin)
const getAllReports = async () => {
  const result = await db.query(
    `SELECT r.*, w.location 
     FROM reports r
     JOIN water_sources w ON r.water_source_id = w.water_source_id
     ORDER BY r.date_created DESC`
  );
  return result.rows;
};

// ✅ Get reports for specific user
const getReportsByUser = async (userId) => {
  const result = await db.query(
    `SELECT r.*, w.location 
     FROM reports r
     JOIN water_sources w ON r.water_source_id = w.water_source_id
     WHERE r.user_id = $1
     ORDER BY r.date_created DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createReport,
  getAllReports,
  getReportsByUser
};
