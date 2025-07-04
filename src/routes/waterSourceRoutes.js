const express = require('express');
const router = express.Router();
const waterSourceController = require('../controllers/waterSourceController');

// POST /api/water-sources - add a new water source
router.post('/', waterSourceController.createWaterSource);

// GET /api/water-sources - get all water sources
router.get('/', waterSourceController.getWaterSources);

module.exports = router;
