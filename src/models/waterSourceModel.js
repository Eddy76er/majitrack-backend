const db = require('../config/db');

// Create a new water source
const createWaterSource = async (type, location) => {
  const result = await db.query(
    `INSERT INTO water_sources (water_source_type, location)
     VALUES ($1, $2) RETURNING *`,
    [type, location]
  );
  return result.rows[0];
};

// Get all water sources
const getAllWaterSources = async () => {
  const result = await db.query('SELECT * FROM water_sources');
  return result.rows;
};

module.exports = {
  createWaterSource,
  getAllWaterSources,
};
