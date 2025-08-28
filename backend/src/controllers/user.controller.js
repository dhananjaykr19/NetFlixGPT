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
    const createdUser = await User.findOne(user?._id).select(" -password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Something went wrong to createdUser");
    }
    res.status(201).json({
        message : "User registered successfully",
        user
    });
});