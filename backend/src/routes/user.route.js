import { Router } from "express";
import { addMovieInList, getMyMovieList, getUserProfile, loginUser, logoutUser, registerUser, removeMovieList } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { protectedUser } from "../middlewares/authUser.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(protectedUser, logoutUser);
router.route("/user").post(protectedUser, getUserProfile);
router.route("/movie-list").get(protectedUser, getMyMovieList);
router.route("/movie-list/addMovie").post(protectedUser, addMovieInList);
router.route("/movie-list/removeMovie").post(protectedUser, removeMovieList);
export default router;