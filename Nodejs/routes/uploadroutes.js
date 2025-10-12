import express from 'express';
import upload from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { auth as authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();

// Upload image to Cloudinary
router.post('/image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    console.log('Uploading file:', req.file.path);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resume-photos',
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    console.log('Cloudinary upload successful:', result.secure_url);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up local file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
});

export default router;