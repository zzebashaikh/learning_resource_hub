/**
 * DATABASE CONFIGURATION
 * 
 * This file handles MongoDB connection using MongoDB Compass (local instance)
 * Connection string format: mongodb://localhost:27017/database_name
 */

const mongoose = require('mongoose');

// MongoDB connection string for LOCAL MongoDB Compass
// Default MongoDB port is 27017
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learning_resource_hub';

/**
 * Connect to MongoDB database
 * This function establishes connection to local MongoDB instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process if database connection fails
  }
};

module.exports = connectDB;

