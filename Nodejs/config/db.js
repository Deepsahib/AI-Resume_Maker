import mongoose from "mongoose";

async function getdb() {
  try {
    await mongoose.connect("mongodb+srv://Sahibdeep:%239y9p82gqv@cluster0.jdtddhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

export default getdb;
