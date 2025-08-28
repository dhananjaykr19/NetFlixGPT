import mongoose from "mongoose";

const watchListSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        movie : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Movie",
            required : true
        },
        addedAt : {
            type : Date,
            default : Date.now
        }
    },
    {timestamps : true}
);

// Ensure a movie can only be added once per user
watchListSchema.index({ user: 1, movie: 1 }, { unique: true });

export const WatchList = mongoose.model("WatchList", watchListSchema);