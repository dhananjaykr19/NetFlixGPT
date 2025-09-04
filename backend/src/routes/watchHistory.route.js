import { Router } from "express";
import { protectedUser } from "../middlewares/authUser.middleware.js";
import { clearWatchHistory, getWatchHistory, updateWatchHistory } from "../controllers/watchHistory.controller.js";

const router = Router();

router.route("/").get(protectedUser, getWatchHistory);
router.route("/update").post(protectedUser, updateWatchHistory);
router.route("/clear").delete(protectedUser, clearWatchHistory);

export default router;