// src/middlewares/validate.js

// Placeholder input validation middleware
const validateReportSubmission = (req, res, next) => {
  const { userId, waterSourceId, description } = req.body;

  if (!userId || !waterSourceId || !description) {
    return res.status(400).json({ message: 'Missing required fields for report submission.' });
  }

  next();
};

module.exports = {
  validateReportSubmission,
};
