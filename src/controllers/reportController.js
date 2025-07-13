const reportModel = require('../models/reportModel');
const userModel = require('../models/userModel'); // To fetch name and phone from users

// ✅ Submit a new water issue report
const submitReport = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from token by auth middleware

    const {
      location,
      water_source_type,
      description,
      status = 'pending',
      date_created
    } = req.body;

    const imagePath = req.file ? req.file.path : null; // Image from multer upload

    // ✅ Get user details for auto-attaching name and phone number
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Save report with all required fields
    const report = await reportModel.createReport({
      userId,
      name: user.name,
      phone_number: user.phone_number,
      location,
      water_source_type,
      description,
      status,
      date_created,
      imagePath
    });

    res.status(201).json({
      message: '✅ Report submitted successfully!',
      report
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: '❌ Failed to submit report' });
  }
};

// ✅ Get all reports (admin use)
const getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.getAllReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching all reports:', error);
    res.status(500).json({ message: '❌ Error fetching reports' });
  }
};

// ✅ Get reports submitted by a specific user
const getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await reportModel.getReportsByUser(userId);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: '❌ Failed to fetch user reports' });
  }
};

module.exports = {
  submitReport,
  getAllReports,
  getUserReports
};
