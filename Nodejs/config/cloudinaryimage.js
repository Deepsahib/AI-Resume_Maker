// imageupload.js
import cloudinary from './cloudinary.js'; // ✅ Import the already configured instance
import fs from 'fs';

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadImage;
