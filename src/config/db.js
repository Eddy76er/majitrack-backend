// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render/Railway PostgreSQL
  }
});

pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL database.'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err));

module.exports = pool;



