const db = require('../config/db');

// ✅ Submit a new report (with Cloudinary image URL)
const createReport = async ({
  userId,
  name,
  phone_number,
  location,
  water_source_type,
  description,
  status,
  date_created,
  imageUrl // Now using imageUrl instead of imagePath
}) => {
  const result = await db.query(
    `INSERT INTO reports (
      user_id,
      name,
      phone_number,
      location,
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
      location,
      water_source_type,
      description,
      status,
      date_created,
      imageUrl // Cloudinary image URL
    ]
  );

  return result.rows[0];
};

// ✅ Get all reports (admin)
const getAllReports = async () => {
  const result = await db.query(
    'SELECT * FROM reports ORDER BY date_created DESC'
  );
  return result.rows;
};

// ✅ Get all reports by a specific user
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
  getReportsByUser
};
