// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://backedn-ohvy.onrender.com/api',
  TIMEOUT: 10000,
  
  // API Endpoints
  ENDPOINTS: {
    // User routes
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    PROFILE: '/user/profile',
    
    // Resume routes
    RESUMES: '/resume',
    CREATE_RESUME: '/resume/create',
    
    // Upload routes
    UPLOAD_IMAGE: '/upload/image',
    
    // Health check
    HEALTH: '/health'
  }
};

export default API_CONFIG;