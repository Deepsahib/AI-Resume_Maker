import express from "express";
import { 
    createresume, 
    getallresumes, 
    getresumebyid, 
    updateresume, 
    deleteresume, 
    duplicateresume, 
    togglepublic 
} from "../controllers/resumecontroller.js";
import { auth } from "../middleware/authmiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new resume
router.post("/create", createresume);

// Get all resumes for logged-in user
router.get("/", getallresumes);

// Get a specific resume by ID
router.get("/:resumeid", getresumebyid);

// Update a resume
router.put("/:resumeid", updateresume);

// Delete a resume
router.delete("/:resumeid", deleteresume);

// Duplicate a resume
router.post("/:resumeid/duplicate", duplicateresume);

// Toggle public status of a resume
router.patch("/:resumeid/toggle-public", togglepublic);

export default router;