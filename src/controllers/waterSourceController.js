const { v4: uuidv4 } = require('uuid');
const waterSourceModel = require('../models/waterSourceModel');

// ✅ Create a new water source
const createWaterSource = async (req, res) => {
  try {
    const { water_source_type, location } = req.body;

    if (!water_source_type || !location) {
      return res.status(400).json({ message: 'Both water_source_type and location are required.' });
    }

    const water_source_id = uuidv4();

    const newSource = await waterSourceModel.createWaterSource(
      water_source_id,
      water_source_type,
      location
    );

    res.status(201).json(newSource);
  } catch (error) {
    console.error('❌ Error creating water source:', error);
    res.status(500).json({ message: 'Failed to create water source.' });
  }
};

// ✅ Get all water sources
const getWaterSources = async (req, res) => {
  try {
    const sources = await waterSourceModel.getAllWaterSources();
    res.status(200).json(sources);
  } catch (error) {
    console.error('❌ Error retrieving water sources:', error);
    res.status(500).json({ message: 'Failed to retrieve water sources.' });
  }
};

// ✅ Get a single water source by ID
const getWaterSourceById = async (req, res) => {
  try {
    const { waterSourceId } = req.params;

    const source = await waterSourceModel.getWaterSourceById(waterSourceId);

    if (!source) {
      return res.status(404).json({ message: 'Water source not found.' });
    }

    res.status(200).json(source);
  } catch (error) {
    console.error('❌ Error retrieving water source by ID:', error);
    res.status(500).json({ message: 'Failed to retrieve water source.' });
  }
};

module.exports = {
  createWaterSource,
  getWaterSources,
  getWaterSourceById,
};
