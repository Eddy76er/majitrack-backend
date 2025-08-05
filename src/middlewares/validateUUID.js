// middleware/validateUUID.js

const { validate: isUUID } = require('uuid');

/**
 * Middleware to validate UUID parameters from request params.
 * @param {string} paramName - The name of the parameter to validate (default is 'id').
 */
const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !isUUID(id)) {
      return res.status(400).json({ error: `Invalid UUID for parameter "${paramName}"` });
    }

    next();
  };
};

module.exports = validateUUID;
