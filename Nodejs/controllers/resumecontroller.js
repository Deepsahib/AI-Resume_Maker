import Resume from "../models/resumemodel.js";

// Create a new resume
export const createresume = async(req, res) => {
    try {
        const userid = req.user; // Fixed: should be req.user from auth middleware
        const { title } = req.body;
        
        const newresume = await Resume.create({
            title: title || "Untitled Resume",
            userId: userid
        });
        
        return res.status(201).json({
            message: "Resume created successfully",
            resume: newresume
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get all resumes for a user
export const getallresumes = async(req, res) => {
    try {
        const userid = req.user;
        const resumes = await Resume.find({ userId: userid }).sort({ updatedAt: -1 });
        
        return res.status(200).json({
            message: "Resumes fetched successfully",
            resumes: resumes
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get a specific resume by ID
export const getresumebyid = async(req, res) => {
    try {
        const userid = req.user;
        const { resumeid } = req.params;
        
        const resume = await Resume.findOne({ userId: userid, _id: resumeid });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        return res.status(200).json({
            message: "Resume fetched successfully",
            resume: resume
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Update a resume
export const updateresume = async(req, res) => {
    try {
        const userid = req.user;
        const { resumeid } = req.params;
        const updateData = req.body;
        
        const resume = await Resume.findOneAndUpdate(
            { userId: userid, _id: resumeid },
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        return res.status(200).json({
            message: "Resume updated successfully",
            resume: resume
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Delete a resume
export const deleteresume = async(req, res) => {
    try {
        const userid = req.user;
        const { resumeid } = req.params;
        
        const resume = await Resume.findOneAndDelete({ userId: userid, _id: resumeid });
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        return res.status(200).json({
            message: "Resume deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Duplicate a resume
export const duplicateresume = async(req, res) => {
    try {
        const userid = req.user;
        const { resumeid } = req.params;
        
        const originalResume = await Resume.findOne({ userId: userid, _id: resumeid });
        if (!originalResume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        const duplicatedResume = new Resume({
            ...originalResume.toObject(),
            _id: undefined,
            title: `${originalResume.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await duplicatedResume.save();
        
        return res.status(201).json({
            message: "Resume duplicated successfully",
            resume: duplicatedResume
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Toggle resume public status
export const togglepublic = async(req, res) => {
    try {
        const userid = req.user;
        const { resumeid } = req.params;
        
        const resume = await Resume.findOne({ userId: userid, _id: resumeid });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        resume.public = !resume.public;
        await resume.save();
        
        return res.status(200).json({
            message: `Resume is now ${resume.public ? 'public' : 'private'}`,
            resume: resume
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}