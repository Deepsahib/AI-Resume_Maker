# Uploads Directory

This directory is used for temporary image uploads before they are processed and uploaded to Cloudinary.

## How it works:
1. User uploads profile image
2. File temporarily stored here via Multer
3. Image uploaded to Cloudinary
4. Local file automatically deleted
5. Cloudinary URL saved to database

## Development
The application automatically creates this directory when needed.