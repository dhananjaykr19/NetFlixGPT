import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Register new admin (super_admin can create others)
export const registerAdmin = asyncHandler( async(req, res) => {
    const {name, email, password, role } = req.body;
    if(
        [name, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    const adminExists = await Admin.findOne({email});
    if(adminExists){
        throw new ApiError(400, "Admin already exists with this email");
    }
    const admin = await Admin.create({
        name, 
        email,
        password,
        role
    });
    const createdAdmin = await Admin.findById(admin?._id).select("-password");
    if(!createdAdmin){
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    res.status(201).json({
        message: "Admin registered successfully",
        admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
});

// Login Page
export const loginAdmin = asyncHandler( async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(400, "Email and Password are required");
    }
    const admin = await Admin.findOne({email});
    if(!admin){
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordMatch = await admin.comparePassword(password);
    if(!isPasswordMatch){
        throw new ApiError(401, "Invalid Password");
    }
    const token = await admin.generateAccessToken();
    res.cookie("accessToken", token,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.json({
        message: "Login successful",
        token, // also return in body if frontend prefers Bearer token
        admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
});

export const logoutAdmin = asyncHandler(async(req, res) => {
    res.clearCookie("accessToken",{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict"
    });
    res.status(200).json({
        message: "Logout successful"
    });
});