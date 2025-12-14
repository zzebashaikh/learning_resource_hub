/**
 * AUTHENTICATION MIDDLEWARE
 * 
 * This middleware verifies JWT tokens and protects routes
 * It extracts token from request headers and validates it
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token
 * 
 * This middleware:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies the token
 * 3. Finds the user associated with the token
 * 4. Attaches user to request object for use in route handlers
 * 
 * Usage: Add this middleware to any route that requires authentication
 * Example: router.get('/profile', protect, getProfile)
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using JWT_SECRET from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from decoded token (without password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Proceed to next middleware/route handler
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };

