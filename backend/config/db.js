// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Support multiple standard MongoDB URI environment variable names
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error('MongoDB URI not found. Please set MONGODB_URI, MONGO_URI, or DATABASE_URL environment variable.');
    }

    const conn = await mongoose.connect(mongoUri, {
      // options can be omitted in latest mongoose
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
