// src/routes/waterSourceRoutes.js

const express = require('express');
const router = express.Router();

// ✅ Correct middleware and controller imports
const validateUUID = require('../middlewares/validateUUID');
const waterSourceController = require('../controllers/waterSourceController');

// ✅ POST /api/water-sources - Add a new water source
router.post('/', waterSourceController.createWaterSource);

// ✅ GET /api/water-sources - Get all water sources
router.get('/', waterSourceController.getWaterSources);

// ✅ GET /api/water-sources/:waterSourceId - Get a specific water source by UUID
router.get(
  '/:waterSourceId',
  validateUUID('waterSourceId'), // Validate UUID param
  waterSourceController.getWaterSourceById
);

module.exports = router;

