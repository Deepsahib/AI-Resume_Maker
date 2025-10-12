import express from "express";
import getdb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userroutes.js";
import resumeRoutes from "./routes/resumeroutes.js";
import uploadRoutes from "./routes/uploadroutes.js";

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(3000,()=>{
    console.log("Server has been started bruh")
    getdb();
})
