/**
 * SERVER ENTRY POINT
 * 
 * This is the main file that starts the Express server
 * Sets up middleware, routes, and database connection
 */

// Load environment variables from .env file FIRST (before any other imports)
// This ensures all environment variables are available throughout the application
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cors()); // Enable CORS for frontend communication

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Learning Resource Hub API is running',
    version: '1.0.0',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
// Use PORT from environment variable, default to 5001 (5000 is often used by AirPlay on macOS)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

