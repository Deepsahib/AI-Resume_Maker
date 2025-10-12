import mongoose from "mongoose";

async function getdb() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://simbasahib9:simba%40123@cluster0.kj1ca.mongodb.net/AI_Resume_Maker?retryWrites=true&w=majority&appName=Cluster0";
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('🔍 MongoDB URI configured:', MONGODB_URI ? 'Yes' : 'No');
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ DB connected successfully");
    console.log('🔍 Connected to database:', mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("❌ Full error:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

export default getdb;
