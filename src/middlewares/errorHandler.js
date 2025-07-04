// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Something went wrong.',
      status: err.status || 500,
    },
  });
};

module.exports = errorHandler;

