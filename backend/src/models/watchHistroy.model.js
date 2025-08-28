import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
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
        progress : {
            type : Number,
            default : 0
        },
        lastWatchedAt : {
            type : Date,
            default : Date.now
        },
        completed : {
            type : Boolean,
            default : false
        },
        device : {
            type : String,
            enum: ["mobile", "web", "tv", "tablet"],
        },
        durationWatched : {
            type : Number,
            default : 0
        },
        lastPosition : {
            type : Number,
            default : 0
        }
    },
    {timestamps : true}
);

watchHistorySchema.index({ user: 1, movie: 1 }, { unique: true });

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);