const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../config/db');

/**
 * Normalize phone number to Kenya local format (07xxxxxxxx)
 */
const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  let cleaned = phone.trim().replace(/\s+/g, '');

  // Convert +2547xxxxxxxx or 2547xxxxxxxx → 07xxxxxxxx
  if (cleaned.startsWith('+254')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('254')) {
    cleaned = '0' + cleaned.slice(3);
  }

  // Must start with 07 and have 10 digits
  if (!/^07\d{8}$/.test(cleaned)) {
    return null;
  }
  return cleaned;
};

/**
 * Create a new user
 * - Assumes password is already hashed before being passed
 * - Normalizes phone number
 */
const createUser = async ({ name, phone_number, password, role }) => {
  try {
    const user_id = uuidv4();

    // Normalize and validate phone number
    phone_number = normalizePhoneNumber(phone_number);
    if (!phone_number) {
      throw new Error('Invalid phone number format. Must be 07xxxxxxxx');
    }

    // If password is not hashed, hash it (safety net)
    if (!password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const result = await db.query(
      `INSERT INTO users (user_id, name, phone_number, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, name, phone_number, role`,
      [user_id, name.trim(), phone_number, password, role.trim().toLowerCase()]
    );

    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creating user in DB:', error.message);
    throw error;
  }
};

/**
 * Get all users (excluding passwords)
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
 * Get user by ID (excluding password)
 */
const getUserById = async (id) => {
  try {
    const result = await db.query(
      `SELECT user_id, name, phone_number, role
       FROM users
       WHERE user_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user by ID from DB:', error.message);
    throw error;
  }
};

/**
 * Delete user by ID
 */
const deleteUserById = async (id) => {
  try {
    const result = await db.query(
      `DELETE FROM users
       WHERE user_id = $1
       RETURNING user_id`,
      [id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('❌ Error deleting user in DB:', error.message);
    throw error;
  }
};

/**
 * Get user by phone number (returns full row for login/password verification)
 */
const getUserByPhone = async (phone_number) => {
  try {
    phone_number = normalizePhoneNumber(phone_number);
    if (!phone_number) {
      return null;
    }

    const result = await db.query(
      `SELECT user_id, name, phone_number, role, password
       FROM users
       WHERE phone_number = $1`,
      [phone_number]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user by phone from DB:', error.message);
    throw error;
  }
};

module.exports = {
  normalizePhoneNumber,
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  getUserByPhone,
};
