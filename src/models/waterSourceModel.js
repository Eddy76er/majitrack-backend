const db = require('../config/db');

// ✅ Create a new water source (with correct column name)
const createWaterSource = async (water_source_type, location) => {
  const result = await db.query(
    `INSERT INTO water_sources (water_source_type, location)
     VALUES ($1, $2) RETURNING *`,
    [water_source_type, location]
  );
  return result.rows[0];
};

// ✅ Get all water sources
const getAllWaterSources = async () => {
  const result = await db.query('SELECT * FROM water_sources ORDER BY water_source_id DESC');
  return result.rows;
};

module.exports = {
  createWaterSource,
  getAllWaterSources,
};
