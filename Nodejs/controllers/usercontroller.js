import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register=async (req,res)=>{
    try {
        console.log('🔍 Register request received:', { body: req.body });
        const {name,email,password}=req.body;
        if(!name||!email||!password){
            console.log('❌ Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({message:"Please fill all the fields"});
        }
        
        console.log('🔍 Checking existing user for email:', email);
        const existingUser=await User.findOne({email});
        if(existingUser){
            console.log('❌ User already exists:', email);
            return res.status(400).json({message:"User already exists"});
        }
        
        const hashedPassword=await bcrypt.hash(password,10);
        const createuser=await User.create({
            name,
            email,
            password:hashedPassword
        });
        
        // Remove password from response
        const userResponse = {
            _id: createuser._id,
            name: createuser.name,
            email: createuser.email,
            createdAt: createuser.createdAt,
            updatedAt: createuser.updatedAt
        };
        
        const token = jwt.sign({ id: createuser._id }, process.env.JWT_SECRET || "sahib", { expiresIn: '1d' });
        res.status(201).json({message:"User registered successfully",user:userResponse,token});
    } catch (error) {
        console.error('❌ Registration error:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            message: "Server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
export const loginuser=async (req,res)=>{
    try {
        console.log('🔍 Login request received:', { email: req.body.email });
        const {email,password}=req.body;
        if(!email||!password){
            console.log('❌ Missing login fields:', { email: !!email, password: !!password });
            return res.status(400).json({message:"Please fill all the fields"});
        }
        
        console.log('🔍 Looking for user:', email);
        const user=await User.findOne({email});
        if(!user){
            console.log('❌ User not found:', email);
            return res.status(400).json({message:"User does not exist"});
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "sahib", { expiresIn: '1d' });
        res.status(200).json({message:"User logged in successfully",user:userResponse,token});
    } catch (error) {
        console.error('❌ Login error:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            message: "Server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
export const getuser=async (req,res)=>{
    const userid=req.user;
    const user=await User.findById(userid).select("-password");
    if(!user){
        return res.status(400).json({message:"User does not exist"});
    }
    res.status(200).json({user});
}
export const getuserresume=async (req,res)=>{
    const userid=req.user;
    const user=await Resume.findById(userid).select("-password");
    if(!user){
        return res.status(400).json({message:"User does not exist"});
    }
    res.status(200).json({user});
}