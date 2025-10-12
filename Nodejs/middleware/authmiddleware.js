import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        console.log('🔍 Auth Debug - Token:', token ? 'Present' : 'Missing');
        console.log('🔍 Auth Debug - Headers:', req.headers.authorization);
        
        if (!token) {
            console.log('❌ Auth Failed - No token provided');
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided.",
                error: "MISSING_TOKEN"
            });
        }
        
        // Use the same secret key as in user controller
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "sahib"); 
        console.log('✅ Auth Success - User ID:', decoded.id);
        req.user = decoded.id;
        next();
    } catch (error) {
        console.log('❌ Auth Failed - Invalid token:', error.message);
        return res.status(403).json({ 
            success: false,
            message: "Invalid or expired token",
            error: "INVALID_TOKEN"
        });
    }
};

// Keep the old export for backward compatibility
export default auth;