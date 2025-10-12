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
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server has been started on port ${PORT}`)
    getdb();
})
