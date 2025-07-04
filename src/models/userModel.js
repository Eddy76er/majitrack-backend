const db = require('../config/db');

// Create a new user (resident or admin)
const createUser = async (name, phoneNumber, role) => {
  const result = await db.query(
    `INSERT INTO users (name, phone_number, role)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, phoneNumber, role]
  );
  return result.rows[0];
};

// Get all users
const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

// Get a user by phone number (useful for login or auth)
const getUserByPhone = async (phoneNumber) => {
  const result = await db.query(
    'SELECT * FROM users WHERE phone_number = $1',
    [phoneNumber]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByPhone,
};
