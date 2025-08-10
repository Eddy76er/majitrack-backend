// src/controllers/userController.js
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// ✅ Normalize phone number to Kenya format (+2547...)
const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  let normalized = phone.replace(/\s+/g, '');
  if (normalized.startsWith('0')) {
    normalized = '+254' + normalized.slice(1);
  }
  return normalized;
};

// ✅ Signup new user (admin or resident)
const signup = async (req, res) => {
  let { name, phone_number, password, role } = req.body;

  // Basic validation
  if (!name || !phone_number || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Normalize phone number
    phone_number = normalizePhoneNumber(phone_number);

    // Check if user already exists
    const existingUser = await userModel.getUserByPhone(phone_number);
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Create new user in DB (model handles hashing)
    const user = await userModel.createUser({
      name,
      phone_number,
      password, // plain password, will be hashed in model
      role
    });

    res.status(201).json({
      message: '✅ User registered successfully',
      user: {
        user_id: user.user_id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ User registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// ✅ Login user
const login = async (req, res) => {
  let { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res.status(400).json({ message: 'Phone number and password are required' });
  }

  try {
    // Normalize phone number
    phone_number = normalizePhoneNumber(phone_number);

    // Find user by phone number
    const user = await userModel.getUserByPhone(phone_number);
    if (!user) {
      console.warn(`⚠️ Login failed: No user found with phone ${phone_number}`);
      return res.status(400).json({ message: 'Invalid phone number or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`⚠️ Login failed: Wrong password for user ${phone_number}`);
      return res.status(400).json({ message: 'Invalid phone number or password.' });
    }

    res.json({
      message: '✅ Login successful',
      user: {
        user_id: user.user_id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// ✅ Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// ✅ Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// ✅ Delete user by ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await userModel.deleteUserById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }
    res.json({ message: '✅ User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  signup,
  login,
  getUsers,
  getUserById,
  deleteUserById
};
