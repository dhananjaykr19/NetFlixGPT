import { Router } from "express";
import { addMovieInList, getUserProfile, loginUser, logoutUser, registerUser, removeMovieList } from "../controllers/user.controller.js";
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
router.route("/addMovie").post(protectedUser, addMovieInList);
router.route("/removeMovie").post(protectedUser, removeMovieList);
export default router;