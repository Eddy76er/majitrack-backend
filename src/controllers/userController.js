// src/controllers/userController.js

const userModel = require('../models/userModel');

// ✅ Signup new user (admin or resident)
const signup = async (req, res) => {
  const { name, phone_number, password, role } = req.body;

  // Basic validation
  if (!name || !phone_number || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create new user in DB
    const user = await userModel.createUser({ name, phone_number, password, role });

    res.status(201).json({
      message: '✅ User registered successfully',
      user: {
        user_id: user.user_id, // UUID format
        name: user.name,
        phone_number: user.phone_number,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// ✅ Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
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
    console.error('Error fetching user:', error);
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
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  signup,
  getUsers,
  getUserById,
  deleteUserById
};
