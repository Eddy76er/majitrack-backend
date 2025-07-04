const waterSourceModel = require('../models/waterSourceModel');

const createWaterSource = async (req, res) => {
  try {
    const { type, location } = req.body;
    const source = await waterSourceModel.createWaterSource(type, location);
    res.status(201).json(source);
  } catch (error) {
    console.error('Error creating water source:', error);
    res.status(500).json({ message: 'Failed to create water source' });
  }
};

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
