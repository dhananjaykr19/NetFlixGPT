import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async(req, res) => {
    const {userName, email, password } = req.body;
    if(
        [userName, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    const userExists = await User.findOne({
        $or : [{userName}, {email}]
    });
    if(userExists){
        throw new ApiError(401, "userName or email already registered");
    }
    // console.log(req.files?.avatar[0]?.path);
    const avatarLocalPath = req?.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file are required");
    }
    const avatar = await cloudinaryUpload(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400, "Avatar file are required");
    }
    const user = await User.create({
        userName,
        email,
        password,
        avatar : avatar.url,
    });
    const createdUser = await User.findById(user?._id).select(" -password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Something went wrong to createdUser");
    }
    res.status(201).json({
        message : "User registered successfully",
        user : createdUser
    });
});

export const loginUser = asyncHandler(async(req, res) => {
    const {email, password } = req.body;
    if([email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "Email and password required");
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new ApiError(401, "Invalid credentials");
    }
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        throw new ApiError(401, "Invalid credentials");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({
        validateBeforeSave : false
    });
    res.cookie("userToken", accessToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userData = await User.findById(user?._id).select("-password -refreshToken");
    res.status(200).json({
        message : "Login successful",
        user : userData,
        accessToken,
        refreshToken,
    });
});

export const logoutUser = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
        $unset : {
            refreshToken : 1
        }
    });
    res.clearCookie("userToken", {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
    });
    res.clearCookie("refreshToken", {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
    });
    res.status(200).json({
        message : "Logged out successfully"
    });
});