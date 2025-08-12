// src/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
require('dotenv').config();

/**
 * Normalize phone number to local format (07xxxxxxxx)
 * Removes spaces and ensures correct format before querying DB
 */
const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  let cleaned = phone.trim().replace(/\s+/g, ''); // remove spaces

  // If starts with +254 or 254, convert to 07xxxxxxxx
  if (cleaned.startsWith('+254')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('254')) {
    cleaned = '0' + cleaned.slice(3);
  }

  // Ensure it starts with 07 and has exactly 10 digits
  if (!/^07\d{8}$/.test(cleaned)) {
    return null; // invalid format
  }

  return cleaned;
};

const login = async (req, res) => {
  try {
    let { phoneNumber, password } = req.body;

    // Check required fields
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    // Normalize and validate phone number
    phoneNumber = normalizePhoneNumber(phoneNumber);
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Invalid phone number format. Use 07xxxxxxxx' });
    }

    // Find user by phone
    const user = await userModel.getUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        role: user.role,
        phone_number: user.phone_number
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login };
