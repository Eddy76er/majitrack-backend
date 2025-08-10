// src/models/userModel.js

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

/**
 * ✅ Create new user
 * Password is already hashed in the controller before calling this function.
 */
const createUser = async ({ name, phone_number, password, role }) => {
  try {
    const user_id = uuidv4();

    const result = await db.query(
      `INSERT INTO users (user_id, name, phone_number, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, name, phone_number, role`,
      [user_id, name, phone_number, password, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating user in DB:', error);
    throw error;
  }
};

/**
 * ✅ Get all users
 */
const getAllUsers = async () => {
  try {
    const result = await db.query(
      `SELECT user_id, name, phone_number, role 
       FROM users 
       ORDER BY name ASC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching all users from DB:', error);
    throw error;
  }
};

/**
 * ✅ Get user by ID
 */
const getUserById = async (id) => {
  try {
    const result = await db.query(
      `SELECT user_id, name, phone_number, role 
       FROM users 
       WHERE user_id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by ID from DB:', error);
    throw error;
  }
};

/**
 * ✅ Delete user by ID
 */
const deleteUserById = async (id) => {
  try {
    const result = await db.query(
      `DELETE FROM users 
       WHERE user_id = $1 
       RETURNING *`,
      [id]
    );
    return result.rowCount > 0; // true if deleted
  } catch (error) {
    console.error('Error deleting user in DB:', error);
    throw error;
  }
};

/**
 * ✅ Get user by phone number (used for login & duplicate check)
 */
const getUserByPhone = async (phone_number) => {
  try {
    const result = await db.query(
      `SELECT * 
       FROM users 
       WHERE phone_number = $1`,
      [phone_number]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by phone from DB:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  getUserByPhone
};
