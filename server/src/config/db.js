const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS SRV lookup issues with MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Fallback silently if custom DNS servers cannot be set
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finance_habit_builder_db';
    console.log(`🔌 Connecting to MongoDB at: ${mongoUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 TIP: Make sure your MongoDB Atlas URI password and IP whitelist are correct, or check local MongoDB.`);
    console.log(`⚠️ Starting API Server in local fallback mode (without MongoDB connection)...`);
    return null;
  }
};

module.exports = connectDB;
