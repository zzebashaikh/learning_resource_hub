/**
 * DATABASE CONFIGURATION
 * 
 * LOCAL MONGODB ONLY
 * Connects to MongoDB running on localhost:27017
 * Database: learning_resource_hub
 */

const mongoose = require('mongoose');

// Force local MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learning_resource_hub';

/**
 * Connect to MongoDB database (LOCAL ONLY)
 */
const connectDB = async () => {
  try {
    console.log('Connecting to LOCAL MongoDB...');
    console.log(`URI: ${MONGODB_URI}`);
    
    const conn = await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB connected (LOCAL)');
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}:${conn.connection.port}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   ${error.message}`);
    console.error('   Ensure MongoDB is running on localhost:27017');
    console.error('   Start MongoDB with: mongod (or via MongoDB Compass)');
    process.exit(1);
  }
};

module.exports = connectDB;
