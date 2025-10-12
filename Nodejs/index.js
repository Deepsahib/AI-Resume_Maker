import express from "express";
import dotenv from "dotenv";
import getdb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userroutes.js";
import resumeRoutes from "./routes/resumeroutes.js";
import uploadRoutes from "./routes/uploadroutes.js";

// Configure dotenv
dotenv.config();

const app=express();

// Simple CORS - Allow all origins for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Resume Maker API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server has been started on port ${PORT}`)
    getdb();
})
