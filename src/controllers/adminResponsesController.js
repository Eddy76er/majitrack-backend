const { createAdminResponse } = require('../models/adminResponseModel');

const sendAdminResponse = async (req, res) => {
  try {
    const { report_id, comments, status } = req.body;

    // Validate required fields from admin input
    if (!report_id || !comments || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newResponse = await createAdminResponse({ report_id, comments, status });

    res.status(201).json({
      message: 'Response sent successfully',
      response: newResponse,
    });
  } catch (error) {
    console.error('Error sending response:', error.message);
    res.status(500).json({ error: 'Failed to send response' });
  }
};

module.exports = {
  sendAdminResponse,
};
