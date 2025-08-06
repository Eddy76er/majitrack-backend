// src/models/userModel.js

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ✅ Create new user
const createUser = async ({ name, phoneNumber, password, role }) => {
  const user_id = uuidv4();
  const result = await db.query(
    `INSERT INTO users (user_id, name, phone_number, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, name, phoneNumber, password, role]
  );
  return result.rows[0];
};

// ✅ Get all users
const getAllUsers = async () => {
  const result = await db.query(
    `SELECT user_id, name, phone_number, role FROM users ORDER BY name ASC`
  );
  return result.rows;
};

// ✅ Get user by ID
const getUserById = async (id) => {
  const result = await db.query(
    `SELECT user_id, name, phone_number, role FROM users WHERE user_id = $1`,
    [id]
  );
  return result.rows[0];
};

// ✅ Delete user by ID
const deleteUserById = async (id) => {
  const result = await db.query(
    `DELETE FROM users WHERE user_id = $1 RETURNING *`,
    [id]
  );
  return result.rowCount > 0; // true if deleted, false otherwise
};

// ✅ Get user by phone number
const getUserByPhone = async (phoneNumber) => {
  const result = await db.query(
    `SELECT * FROM users WHERE phone_number = $1`,
    [phoneNumber]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  getUserByPhone
};


