import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : [true, "Movie title is required"],
            trim : true,
        },
        description : {
            type : String,
            required : [true, "Movie description is required"]
        },
        type : {
            type : String,
            enum : ["movie", "series"],
            default : "movie"
        },
        genres : [
            {
                type : String // e.g. "Action", "Comedy", "Drama"
            },
        ],
        releaseYear : {
            type : Number
        },
        rating : {
            type : Number,
            min : 0,
            max : 5,
            default : 0
        },
        duration : {
            type : String
        },
        language : {
            type : String,
            enum : ["English", "Hindi"],
            default : "English"
        },
        posterUrl : {
            type : String,
            required : true
        },
        trailerUrl : {
            type : String
        },
        videoUrl : {
            type : String
        },
        isFeatured : {
            type : Boolean,
            default : false
        },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        cast : [
            {
                name : String,
                role : String
            }
        ],
        maturityRating : {
            type : String,
            enum : ["G", "PG", "PG-13", "R", "18+"],
            default : "PG",
        },
        seasons : [
            {
                seasonNumber: Number,
                episodes : [
                    {
                        title : String,
                        duration : String,
                        videoUrl : String,
                        releaseDate : {
                            type : Date
                        }
                    }
                ]
            }
        ],
        views : {
            type : Number,
            default : 0
        },
        likes : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            }
        ],
        tags : [
            String
        ],
        availableRegions : [
            String
        ],
        subtitles: [
            String
        ],
        audio: [
            String
        ]
    },{timestamps : true}
);

export const Movie = mongoose.model("Movie", movieSchema);