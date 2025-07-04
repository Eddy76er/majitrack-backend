// Load environment variables
require('dotenv').config();

// Import the Express app from src/app.js
const app = require('./src/app');

// Define the port (use .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Majitrack API server running at http://localhost:${PORT}`);
});
