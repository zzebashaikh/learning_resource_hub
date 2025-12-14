/**
 * RESOURCE MODEL
 * 
 * This schema defines the structure for learning resource documents
 * Fields: title, description, category, link, createdBy, likes, ratings, createdAt
 */

const mongoose = require('mongoose');

/**
 * Rating Schema (embedded in Resource)
 * Stores individual user ratings (1-5 stars)
 */
const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true,
});

/**
 * Resource Schema Definition
 * - title: Name/title of the learning resource
 * - description: Detailed description of the resource
 * - category: Type of resource (e.g., 'Web Development', 'Data Science', etc.)
 * - link: URL to the resource
 * - createdBy: Reference to User who created this resource
 * - likes: Array of user IDs who liked this resource
 * - ratings: Array of rating objects (user + rating value)
 * - averageRating: Calculated average of all ratings
 * - createdAt: Timestamp of resource creation
 */
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Programming Languages',
        'Database',
        'DevOps',
        'UI/UX Design',
        'Cybersecurity',
        'Other',
      ],
    },
    link: {
      type: String,
      required: [true, 'Please provide a resource link'],
      trim: true,
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid URL (must start with http:// or https://)',
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    ratings: [ratingSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Pre-save middleware: Calculate average rating before saving
 * Automatically updates averageRating field based on ratings array
 */
resourceSchema.pre('save', function (next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
  } else {
    this.averageRating = 0;
  }
  next();
});

// Export Resource model
module.exports = mongoose.model('Resource', resourceSchema);

