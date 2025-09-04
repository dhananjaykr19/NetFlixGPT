import { Router } from "express";
import { protectAdmin } from "../middlewares/authAdmin.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { addMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from "../controllers/movie.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllMovies);
router.route("/:movieId").get(getMovieById);
router.route("/add").post(protectAdmin, isAdmin("super_admin"), upload.fields([
    {
        name : "poster",
        maxCount : 1
    },
    {
        name : "trailer",
        maxCount : 1
    }
]), addMovie);
router.route("/:movieId").put(protectAdmin, isAdmin("super_admin"), upload.fields([
    {
        name : "poster",
        maxCount : 1
    },
    {
        name : "trailer",
        maxCount : 1
    }
]),updateMovie);
router.route("/:movieId").delete(protectAdmin, isAdmin("super_admin"), deleteMovie);
export default router;