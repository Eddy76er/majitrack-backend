const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const createUser = async ({ name, phone_number, password, role }) => {
  const user_id = uuidv4();
  const result = await db.query(
    `INSERT INTO users (user_id, name, phone_number, password, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, name, phone_number, password, role]
  );
  return result.rows[0];
};

module.exports = { createUser };
