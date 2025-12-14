/**
 * RESOURCE ROUTES
 * 
 * Defines all resource-related API endpoints
 * Routes for CRUD operations, search, filter, like, bookmark, rate
 */

const express = require('express');
const router = express.Router();
const {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  likeResource,
  rateResource,
  getMyResources,
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getResources); // Get all resources with search/filter
router.get('/:id', getResource); // Get single resource

// Protected routes (authentication required)
router.post('/', protect, createResource); // Create resource
router.put('/:id', protect, updateResource); // Update resource
router.delete('/:id', protect, deleteResource); // Delete resource
router.put('/:id/like', protect, likeResource); // Like/unlike resource
router.post('/:id/rate', protect, rateResource); // Rate resource
router.get('/user/my-resources', protect, getMyResources); // Get user's resources

module.exports = router;

