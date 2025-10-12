import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ 
            error: "Access denied. No token provided." 
        });
    }
    
    try {
        // Use the same secret key as in user controller
        const decoded = jwt.verify(token, "sahib"); 
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ 
            error: "Invalid token" 
        });
    }
};

// Keep the old export for backward compatibility
export default auth;