import express from "express";
import { register, loginuser, getuser } from "../controllers/usercontroller.js";
import { auth } from "../middleware/authmiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", loginuser);

// Protected Routes
router.get("/profile", auth, getuser);

export default router;