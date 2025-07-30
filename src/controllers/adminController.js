const adminResponsesModel = require('../models/adminResponsesModel');
const reportModel = require('../models/reportModel');

const respondToReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminUserId, comments } = req.body;

    // Create response entry using the new model
    const response = await adminResponsesModel.sendResponse({
      report_id: reportId,
      comments,
      status: 'resolved', // Maintaining same functionality as markReportResolved
      adminUserId // This will be available in the model if needed
    });

    // Update report status (now handled within sendResponse)
    // Original markReportResolved functionality is now integrated
    // in adminResponsesModel.sendResponse

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