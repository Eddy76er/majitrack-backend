const adminResponsesModel = require('../models/adminResponsesModel');
const reportModel = require('../models/reportModel');
const { validate: isValidUUID } = require('uuid');

const respondToReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminUserId, comments } = req.body;

    // ✅ Validate UUIDs
    if (!isValidUUID(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID format (UUID expected)' });
    }

    if (!isValidUUID(adminUserId)) {
      return res.status(400).json({ message: 'Invalid admin user ID format (UUID expected)' });
    }

    // Create response entry using the new model
    const response = await adminResponsesModel.sendResponse({
      report_id: reportId,
      comments,
      status: 'resolved', // Maintaining same functionality as markReportResolved
      adminUserId // This will be available in the model if needed
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error responding to report:', error);
    res.status(500).json({ 
      message: 'Failed to respond to report',
      error: error.message 
    });
  }
};

const getResponse = async (req, res) => {
  try {
    const { reportId } = req.params;

    // ✅ Validate UUID
    if (!isValidUUID(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID format (UUID expected)' });
    }

    const response = await adminResponsesModel.getResponseByReport(reportId);
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ 
      message: 'Error fetching response',
      error: error.message 
    });
  }
};

module.exports = {
  respondToReport,
  getResponse,
};
