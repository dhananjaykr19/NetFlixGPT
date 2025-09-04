import { WatchHistory } from "../models/watchHistory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWatchHistory = asyncHandler(async(req, res) => {
    const userId = req?.user?._id;
    const history = await WatchHistory.find({user : userId})
    .populate("movie", "title posterUrl duration")
    .sort({updateAt : ""});
    res.status(200).json({
        success : true,
        message : "Watch history fetched",
        data : history
    });
});

export const updateWatchHistory = asyncHandler(async(req, res) => {
    const {
        movieId,
        progress,
        lastPosition,
        durationWatched,
        completed,
        device
    } = req.body;
    const userId = req?.user?._id;
    if(!movieId){
        throw new ApiError(400, "Movie ID is required");
    }
    const history = await WatchHistory.findOneAndUpdate(
        {
            user : userId,
            movie : movieId
        },
        {
            $set : {
                progress,
                lastPosition,
                durationWatched,
                completed : completed || false,
                device,
                lastWatchedAt : Date.now()
            }
        },
        {
            new : true,
            upsert : true
        }
    );
    res.status(200).json({
        success : true,
        message : "Watch history updated",
        data : history
    });
});

export const clearWatchHistory = asyncHandler(async(req, res) => {
    const { movieId } = req.body;
    const userId = req?.user?._id;
    await WatchHistory.findOneAndDelete({user : userId, movie : movieId});
    res.status(200).json({
        success : true,
        message : "Watch history cleared",
        data : null
    });
});