const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are defaults in Mongoose 6+, but explicit is better
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas unreachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Kill process — can't run without DB
  }
};

module.exports = connectDB;
