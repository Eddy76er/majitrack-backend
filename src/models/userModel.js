const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Create a new user with hashed password
const createUser = async ({ name, phoneNumber, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (name, phone_number, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, phoneNumber, hashedPassword, role]
  );

  return result.rows[0];
};

// ✅ Get all users (admin use)
const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

// ✅ Get a user by phone number (used for phone login)
const getUserByPhone = async (phoneNumber) => {
  const result = await db.query(
    'SELECT * FROM users WHERE phone_number = $1',
    [phoneNumber]
  );
  return result.rows[0];
};

// ✅ Get a user by ID (used for attaching name/phone to reports)
const getUserById = async (userId) => {
  const result = await db.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByPhone,
  getUserById
};
