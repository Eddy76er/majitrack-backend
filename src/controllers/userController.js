const userModel = require('../models/userModel');

// Register new user (admin or resident)
const registerUser = async (req, res) => {
  try {
    const { name, phoneNumber, role } = req.body;
    const user = await userModel.createUser(name, phoneNumber, role);
    res.status(201).json(user);
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = {
  registerUser,
  getUsers,
};
