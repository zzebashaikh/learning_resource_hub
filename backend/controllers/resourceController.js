/**
 * RESOURCE CONTROLLER
 * 
 * Handles all CRUD operations for learning resources
 * Includes: Create, Read, Update, Delete, Search, Filter, Like, Bookmark, Rate
 */

const Resource = require('../models/Resource');

/**
 * @route   POST /api/resources
 * @desc    Create a new learning resource
 * @access  Private (only authenticated users)
 */
const createResource = async (req, res) => {
  try {
    const { title, description, category, link } = req.body;

    // Validate input
    if (!title || !description || !category || !link) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and link',
      });
    }

    // Create new resource
    const resource = await Resource.create({
      title,
      description,
      category,
      link,
      createdBy: req.user.id, // Set creator to current user
    });

    // Populate creator details
    await resource.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: { resource },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating resource',
    });
  }
};

/**
 * @route   GET /api/resources
 * @desc    Get all resources with search and filter
 * @access  Public
 */
const getResources = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    // Build query object
    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Build sort object
    let sortBy = {};
    if (sort === 'newest') {
      sortBy = { createdAt: -1 }; // Newest first
    } else if (sort === 'oldest') {
      sortBy = { createdAt: 1 }; // Oldest first
    } else if (sort === 'rating') {
      sortBy = { averageRating: -1 }; // Highest rating first
    } else if (sort === 'likes') {
      sortBy = { likes: -1 }; // Most likes first
    } else {
      sortBy = { createdAt: -1 }; // Default: newest first
    }

    // Fetch resources with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const resources = await Resource.find(query)
      .populate('createdBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { resources },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching resources',
    });
  }
};

/**
 * @route   GET /api/resources/:id
 * @desc    Get single resource by ID
 * @access  Public
 */
const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { resource },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching resource',
    });
  }
};

/**
 * @route   PUT /api/resources/:id
 * @desc    Update a resource (only by creator or admin)
 * @access  Private
 */
const updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check if user is creator or admin
    if (
      resource.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this resource',
      });
    }

    // Update resource
    resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: { resource },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating resource',
    });
  }
};

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource (only by creator or admin)
 * @access  Private
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check if user is creator or admin
    if (
      resource.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource',
      });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting resource',
    });
  }
};

/**
 * @route   PUT /api/resources/:id/like
 * @desc    Like or unlike a resource
 * @access  Private
 */
const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    const userId = req.user.id;
    const isLiked = resource.likes.includes(userId);

    if (isLiked) {
      // Unlike: remove user from likes array
      resource.likes = resource.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Like: add user to likes array
      resource.likes.push(userId);
    }

    await resource.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Resource unliked' : 'Resource liked',
      data: { resource },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error liking resource',
    });
  }
};

/**
 * @route   POST /api/resources/:id/rate
 * @desc    Rate a resource (1-5 stars)
 * @access  Private
 */
const rateResource = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5',
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check if user already rated this resource
    const existingRatingIndex = resource.ratings.findIndex(
      (r) => r.user.toString() === req.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      resource.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      resource.ratings.push({
        user: req.user.id,
        rating,
      });
    }

    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource rated successfully',
      data: { resource },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error rating resource',
    });
  }
};

/**
 * @route   GET /api/resources/user/my-resources
 * @desc    Get all resources created by current user
 * @access  Private
 */
const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: { resources },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your resources',
    });
  }
};

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  likeResource,
  rateResource,
  getMyResources,
};

