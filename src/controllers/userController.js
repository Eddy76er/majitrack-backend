const userModel = require('../models/userModel');

// ✅ Register new user (admin or resident)
const registerUser = async (req, res) => {
  const { name, phoneNumber, password, role } = req.body;

  // Basic validation
  if (!name || !phoneNumber || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await userModel.createUser({ name, phoneNumber, password, role });

    res.status(201).json({
      message: '✅ User registered successfully',
      user: {
        id: user.user_id, // UUID format
        name: user.name,
        phoneNumber: user.phone_number,
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
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = {
  registerUser,
  getUsers
};
