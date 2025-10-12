import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqccyc1go', 
  api_key: process.env.CLOUDINARY_API_KEY || '549775151949724', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Rtn4tx2cwL9OjYMSOGWVuqvlOco',
});

export default cloudinary;
