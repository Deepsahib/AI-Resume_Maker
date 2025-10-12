import mongoose from "mongoose";

async function getdb() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://simbasahib9:simba%40123@cluster0.kj1ca.mongodb.net/AI_Resume_Maker?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

export default getdb;
