/**
 * ERROR HANDLER UTILITY
 * 
 * Centralized error handling for the application
 * Provides consistent error response format
 */

/**
 * Custom Error Handler Middleware
 * 
 * This middleware catches errors and sends consistent error responses
 * Should be added at the end of middleware chain in server.js
 */
const errorHandler = (err, req, res, next) => {
  // Default error status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: err.stack, // Always show stack trace for local development
  });
};

module.exports = { errorHandler };

