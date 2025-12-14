/**
 * ADMIN MIDDLEWARE
 * 
 * This middleware checks if the authenticated user has admin role
 * Must be used AFTER the protect middleware
 */

/**
 * Check if user is admin
 * 
 * This middleware:
 * 1. Checks if user exists (should be attached by protect middleware)
 * 2. Verifies user role is 'admin'
 * 3. Allows access if admin, otherwise returns 403 Forbidden
 * 
 * Usage: Add this middleware AFTER protect middleware
 * Example: router.delete('/resource/:id', protect, admin, deleteResource)
 */
const admin = (req, res, next) => {
  // Check if user exists and has admin role
  if (req.user && req.user.role === 'admin') {
    next(); // Allow access
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

module.exports = { admin };

