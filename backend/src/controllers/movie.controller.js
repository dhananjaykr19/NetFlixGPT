import { Movie } from "../models/movie.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

export const getAllMovies = asyncHandler(async(_, res) => {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json({
        success : true,
        message: "Movies fetched successfully",
        data: movies,
    });
});

export const getMovieById = asyncHandler(async(req, res) => {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if(!movie){
        throw new ApiError(404, "Movie not found");
    }
    res.status(200).json({
        success : true,
        message: "Movie fetched successfully",
        data: movie,
    });
});

export const addMovie = asyncHandler(async(req, res) => {
    const {
        title,
        description,
        type,
        genres,
        releaseYear,
        duration,
        language,
        videoUrl, 
        maturityRating,
        tags,
    } = req.body;
    if(
        [title, description].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "Title and description are required");
    }
    const posterLocalPath = req?.files?.poster[0]?.path;
    if(!posterLocalPath){
        throw new ApiError(400, "Poster is required");
    }
    const poster = await cloudinaryUpload(posterLocalPath);
    const trailerLocalPath = req?.files?.trailer[0]?.path;
    if(!trailerLocalPath){
        throw new ApiError(400, "Trailer is required");
    }
    const trailer = await cloudinaryUpload(trailerLocalPath);
    const movie = await Movie.create({
        title,
        description,
        type,
        genres,
        releaseYear,
        duration,
        language,
        posterUrl : poster.url,
        trailerUrl : trailer.url,
        videoUrl,
        maturityRating,
        tags,
        createdBy : req.admin._id
    });
    res.status(201).json({
        success : true,
        message : "Movie added successfully",
        data: movie,
    });
});

export const updateMovie = asyncHandler(async(req, res) => {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if(!movie){
        throw new ApiError(404, "Movie not found");
    }
    Object.assign(movie, req.body);
    res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: movie,
    });
});

export const deleteMovie = asyncHandler(async(req, res) => {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    await movie.deleteOne();
    res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
    });
});