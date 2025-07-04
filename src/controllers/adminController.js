const responseModel = require('../models/responseModel');
const reportModel = require('../models/reportModel');

const respondToReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminUserId, comments } = req.body;

    // Create response entry
    const response = await responseModel.createAdminResponse(reportId, adminUserId, comments);

    // Update report status
    await reportModel.markReportResolved(reportId);  // Add this in reportModel if needed

    res.status(200).json(response);
  } catch (error) {
    console.error('Error responding to report:', error);
    res.status(500).json({ message: 'Failed to respond to report' });
  }
};

const getResponse = async (req, res) => {
  try {
    const { reportId } = req.params;
    const response = await responseModel.getResponseByReport(reportId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching response' });
  }
};

module.exports = {
  respondToReport,
  getResponse,
};
