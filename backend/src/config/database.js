const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MongoDB URI provided. Running without database.');
      console.log('💡 Set MONGODB_URI in .env to enable database features.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Running without database. Some features may not work.');
    // Don't exit the process, just log the error
  }
};

module.exports = connectDB;
