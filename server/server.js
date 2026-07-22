require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.log('⚠️ MONGO_URI not found in .env, running server without database connection');
  }
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
