/**
 * USER MODEL
 * 
 * This schema defines the structure for user documents in MongoDB
 * Fields: name, email, password, role, bookmarks, createdAt
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * - name: User's full name
 * - email: Unique email address (used for login)
 * - password: Hashed password using bcrypt
 * - role: Either 'learner' (default) or 'admin'
 * - bookmarks: Array of resource IDs that user has bookmarked
 * - createdAt: Timestamp of account creation
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['learner', 'admin'],
      default: 'learner',
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Pre-save middleware: Hash password before saving to database
 * This runs automatically before saving a new user or updating password
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's been modified (new or changed)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password with cost factor of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare entered password with hashed password
 * Used during login authentication
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export User model
module.exports = mongoose.model('User', userSchema);

