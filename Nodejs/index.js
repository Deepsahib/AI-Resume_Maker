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

// CORS configuration - Fixed
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
};

// Apply CORS first
app.use(cors(corsOptions));

// Add manual CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
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
