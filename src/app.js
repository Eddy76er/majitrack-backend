const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Core middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('🚀 Majitrack API is running...');
});

// ✅ Swagger setup
const setupSwagger = require('./config/swagger');
setupSwagger(app); // Available at /api-docs

// ✅ Route imports
const userRoutes = require('./routes/userRoutes');
const waterSourceRoutes = require('./routes/waterSourceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');

// ✅ Mount routes
app.use('/api/users', userRoutes);
app.use('/api/water-sources', waterSourceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

// ✅ Error handling middleware (keep last)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
