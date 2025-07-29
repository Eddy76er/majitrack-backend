const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Core middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

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
const adminResponsesRoute = require('./routes/adminResponsesRoute'); // ✅ NEW

// ✅ Mount routes
app.use('/api/users', userRoutes);
app.use('/api/water-sources', waterSourceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/responses', adminResponsesRoute); // ✅ NEW LINE
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

// ✅ Error handling middleware (keep last)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
