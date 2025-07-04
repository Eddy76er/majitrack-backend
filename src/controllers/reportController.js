const reportModel = require('../models/reportModel');

const submitReport = async (req, res) => {
  try {
    const { userId, waterSourceId, description } = req.body;
    const report = await reportModel.createReport(userId, waterSourceId, description);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Failed to submit report' });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.getAllReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

const getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await reportModel.getReportsByUser(userId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reports' });
  }
};

module.exports = {
  submitReport,
  getAllReports,
  getUserReports,
};
