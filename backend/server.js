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

// Set JWT_SECRET from .env (defaults to devsecret for local development)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'devsecret';
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB database (LOCAL ONLY)
connectDB();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Request logging middleware (for local development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// CORS configuration for local development
// Frontend runs on http://localhost:5173 (Vite default port)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

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
// Backend runs on http://localhost:5001 for local development
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('\n🚀 Backend Server Started');
  console.log(`   Server: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   CORS: Enabled for http://localhost:5173\n`);
});

