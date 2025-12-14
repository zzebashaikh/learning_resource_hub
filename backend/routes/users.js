/**
 * USER ROUTES
 * 
 * Defines all user-related API endpoints
 * Routes: Get all users (admin), bookmark management
 */

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleBookmark,
  getBookmarks,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Protected routes
router.get('/', protect, admin, getAllUsers); // Get all users (admin only)
router.put('/bookmark/:resourceId', protect, toggleBookmark); // Toggle bookmark
router.get('/bookmarks', protect, getBookmarks); // Get user's bookmarks

module.exports = router;

