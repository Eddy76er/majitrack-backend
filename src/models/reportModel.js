const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const createReport = async ({ user_id, description, status, name, phone_number, image_path, water_source_id, water_source_type }) => {
  const report_id = uuidv4();
  const result = await db.query(
    `INSERT INTO reports (report_id, user_id, description, status, name, phone_number, image_path, water_source_id, water_source_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [report_id, user_id, description, status, name, phone_number, image_path, water_source_id, water_source_type]
  );
  return result.rows[0];
};

module.exports = { createReport };
