import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
        rating : {
            type : Number,
            min : 0,
            max : 5,
            required : true
        },
        liked : {
            type : String,
            enum: ["thumbs_up", "thumbs_down", "none"],
            default : "none"
        },
        reviewText: {
            type: String,
            trim: true,
        },
    },
    {timestamps : true}
);


// Prevent multiple reviews by same user on same movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });
reviewSchema.index({ movie: 1 });


export const Review = mongoose.model("Review", reviewSchema);