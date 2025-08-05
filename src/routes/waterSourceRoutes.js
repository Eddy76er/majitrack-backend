// src/routes/waterSourceRoutes.js

const express = require('express');
const router = express.Router();
const validateUUID = require('../middlewares/validateUUID'); // ✅ Corrected import
const waterSourceController = require('../controllers/waterSourceController');

// ✅ POST /api/water-sources - add a new water source
router.post('/', waterSourceController.createWaterSource);

// ✅ GET /api/water-sources - get all water sources
router.get('/', waterSourceController.getWaterSources);

// ✅ (GET /api/water-sources/:waterSourceId

router.get('/:waterSourceId', validateUUID('waterSourceId'), waterSourceController.getWaterSourceById);

module.exports = router;
