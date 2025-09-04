import { Router } from "express";
import { protectAdmin } from "../middlewares/authAdmin.middleware.js";
import { requireRole } from "../middlewares/isAdmin.middleware.js";
import { addMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from "../controllers/movie.controller.js";

const router = Router();

router.route("/").get(getAllMovies);
router.route("/:movieId").get(getMovieById);
router.route("/add").post(protectAdmin, requireRole("super_admin"), addMovie);
router.route("/:movieId").put(protectAdmin, requireRole("super_admin"), updateMovie);
router.route("/:movieId").delete(protectAdmin, requireRole("super_admin"), deleteMovie);
export default router;