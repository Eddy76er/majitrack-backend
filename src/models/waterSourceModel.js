const db = require('../config/db');

// ✅ Create a new water source (UUID is passed from controller)
const createWaterSource = async (water_source_id, water_source_type, location) => {
  const result = await db.query(
    `INSERT INTO water_sources (water_source_id, water_source_type, location)
     VALUES ($1, $2, $3) RETURNING *`,
    [water_source_id, water_source_type, location]
  );
  return result.rows[0];
};

// ✅ Get all water sources
const getAllWaterSources = async () => {
  const result = await db.query(`SELECT * FROM water_sources ORDER BY location ASC`);
  return result.rows;
};

// ✅ Get water source by ID
const getWaterSourceById = async (water_source_id) => {
  const result = await db.query(
    `SELECT * FROM water_sources WHERE water_source_id = $1`,
    [water_source_id]
  );
  return result.rows[0];
};

module.exports = {
  createWaterSource,
  getAllWaterSources,
  getWaterSourceById,
};

