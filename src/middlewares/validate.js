// src/middlewares/validate.js

const { validate: isUuid } = require('uuid');

/**
 * Placeholder input validation middleware for report submission
 * Validates presence and correct UUID format for userId and waterSourceId
 */
const validateReportSubmission = (req, res, next) => {
  const { userId, waterSourceId, description } = req.body;

  if (!userId || !waterSourceId || !description) {
    return res.status(400).json({ message: 'Missing required fields for report submission.' });
  }

  if (!isUuid(userId) || !isUuid(waterSourceId)) {
    return res.status(400).json({ message: 'Invalid UUID format for userId or waterSourceId.' });
  }

  next();
};

module.exports = {
  validateReportSubmission,
};

