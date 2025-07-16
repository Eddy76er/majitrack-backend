const waterSourceModel = require('../models/waterSourceModel');

// ✅ Controller to create new water source
const createWaterSource = async (req, res) => {
  try {
    const { water_source_type, location } = req.body;

    if (!water_source_type || !location) {
      return res.status(400).json({ message: 'Both water_source_type and location are required' });
    }

    const source = await waterSourceModel.createWaterSource(water_source_type, location);
    res.status(201).json(source);
  } catch (error) {
    console.error('Error creating water source:', error);
    res.status(500).json({ message: 'Failed to create water source' });
  }
};

// ✅ Controller to fetch all water sources
const getWaterSources = async (req, res) => {
  try {
    const sources = await waterSourceModel.getAllWaterSources();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving water sources' });
  }
};

module.exports = {
  createWaterSource,
  getWaterSources,
};
