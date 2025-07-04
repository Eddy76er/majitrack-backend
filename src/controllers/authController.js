const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const login = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const user = await userModel.getUserByPhone(phoneNumber);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.user_id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.user_id,
      name: user.name,
      role: user.role,
    },
  });
};

module.exports = { login };
