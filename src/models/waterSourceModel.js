const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const addWaterSource = async ({ water_source_type, location }) => {
  const water_source_id = uuidv4();
  const result = await db.query(
    `INSERT INTO water_sources (water_source_id, water_source_type, location)
     VALUES ($1, $2, $3) RETURNING *`,
    [water_source_id, water_source_type, location]
  );
  return result.rows[0];
};

module.exports = { addWaterSource };
