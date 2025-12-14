/**
 * USER CONTROLLER
 * 
 * Handles user-related operations
 * Includes: Get all users (admin only), bookmark management
 */

const User = require('../models/User');
const Resource = require('../models/Resource');

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
    });
  }
};

/**
 * @route   PUT /api/users/bookmark/:resourceId
 * @desc    Bookmark or unbookmark a resource
 * @access  Private
 */
const toggleBookmark = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Get user with bookmarks
    const user = await User.findById(userId);

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.includes(resourceId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== resourceId
      );
    } else {
      // Add bookmark
      user.bookmarks.push(resourceId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isBookmarked ? 'Bookmark removed' : 'Resource bookmarked',
      data: { bookmarks: user.bookmarks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling bookmark',
    });
  }
};

/**
 * @route   GET /api/users/bookmarks
 * @desc    Get all bookmarked resources for current user
 * @access  Private
 */
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: {
        path: 'createdBy',
        select: 'name email',
      },
    });

    res.status(200).json({
      success: true,
      count: user.bookmarks.length,
      data: { bookmarks: user.bookmarks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookmarks',
    });
  }
};

module.exports = {
  getAllUsers,
  toggleBookmark,
  getBookmarks,
};

