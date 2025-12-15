/**
 * AUTHENTICATION CONTROLLER
 * 
 * Handles user registration and login
 * Generates JWT tokens for authenticated users
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Generate JWT Token
 * 
 * Creates a signed JWT token containing user ID
 * Token expires in 30 days
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('POST /api/auth/register - Registration attempt:', { email, name: name?.substring(0, 10) + '...' });

    // Validate input
    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    /**
     * Create new user
     * 
     * SECURITY: Role is NOT accepted from request body
     * All new users are explicitly set to 'learner' role
     * Admin roles must be assigned manually via database
     * 
     * This prevents privilege escalation attacks where users could
     * self-assign admin role during registration.
     * 
     * Password will be hashed by pre-save middleware using bcrypt
     */
    console.log('Creating new user in MongoDB...');
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by pre-save middleware using bcrypt
      role: 'learner', // Explicitly set role to 'learner' (security best practice)
    });

    console.log('User created successfully in MongoDB:', { id: user._id, email: user.email, role: user.role });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response with user data and token
    console.log('Registration successful, returning response');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('POST /api/auth/login - Login attempt:', { email });

    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Login failed: Password mismatch for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('Login successful for user:', { id: user._id, email: user.email, role: user.role });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response with user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bookmarks: user.bookmarks,
        },
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};

