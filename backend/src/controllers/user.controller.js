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
        success: true,
        message: "User registered successfully",
        data: createdUser

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
        success: true,
        message: "Login successful",
        data: userData
    });
});

export const logoutUser = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
        $unset : {
            refreshToken : ""
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
        success: true,
        message: "Logged out successfully"
    });
});

export const getUserProfile = asyncHandler(async(req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: req.user,
    });
});

export const getMyMovieList = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(401, "Invalid credentials");
    }
    res.status(200).json({
        success : true,
        message : "Fetched My List successfully",
        data : user?.myList
    });
});

export const addMovieInList = asyncHandler(async(req, res) => {
    const { movieId } = req.body;
    if(!movieId){
        throw new ApiError(400, "Movie ID is required");
    }
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400, "user Id is required");
    }
    const user = await User.findById(userId);
    if(user.myList.some((id) => id.toString() === movieId)){
        throw new ApiError(400, "Movie already in list");
    }
    user.myList.push(movieId);
    await user.save();
    res.status(200).json({
        success: true,
        message: "Movie added to MyList",
        data: user.myList
    });
});

export const removeMovieList = asyncHandler(async(req, res) => {
    const { movieId } = req.body;
    if (!movieId) 
        throw new ApiError(400, "Movie ID is required");
    const user = await User.findById(req.user._id);
    user.myList = user.myList.filter(id => id.toString() !== movieId);
    await user.save();
    res.status(200).json({
        success: true,
        message: "Movie removed from MyList",
        data: user.myList
    });
});