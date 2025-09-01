import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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
export default router;