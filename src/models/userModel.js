// src/models/userModel.js

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// ✅ Normalize phone number to Kenya local format (07xxxxxxxx)
const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  let cleaned = phone.trim().replace(/\s+/g, '');

  // Convert +2547xxxxxxxx or 2547xxxxxxxx → 07xxxxxxxx
  if (cleaned.startsWith('+254')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('254')) {
    cleaned = '0' + cleaned.slice(3);
  }

  // Validate format
  if (!/^07\d{8}$/.test(cleaned)) {
    return null; // Invalid
  }

  return cleaned;
};

/**
 * ✅ Create new user
 * Always hashes the password before saving to DB.
 */
const createUser = async ({ name, phone_number, password, role }) => {
  try {
    const user_id = uuidv4();

    // Normalize phone number
    phone_number = normalizePhoneNumber(phone_number);
    if (!phone_number) {
      throw new Error('Invalid phone number format. Must be 07xxxxxxxx');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (user_id, name, phone_number, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, name, phone_number, role`,
      [user_id, name, phone_number, hashedPassword, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creating user in DB:', error.message);
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
    console.error('❌ Error fetching all users from DB:', error.message);
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
    console.error('❌ Error fetching user by ID from DB:', error.message);
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
    console.error('❌ Error deleting user in DB:', error.message);
    throw error;
  }
};

/**
 * ✅ Get user by phone number (used for login & duplicate check)
 */
const getUserByPhone = async (phone_number) => {
  try {
    phone_number = normalizePhoneNumber(phone_number);
    if (!phone_number) {
      return null; // Prevent DB query with invalid format
    }

    const result = await db.query(
      `SELECT * 
       FROM users 
       WHERE phone_number = $1`,
      [phone_number]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error fetching user by phone from DB:', error.message);
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
