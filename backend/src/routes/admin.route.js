import { Router } from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { protectAdmin, requireRole } from "../middlewares/authAdmin.middleware.js";
import { Admin } from "../models/admin.model.js";

const router = Router();

router.route("/register").post(async(req, res, next) => {
    const count = await Admin.countDocuments();
    if(count === 0){
        return registerAdmin(req, res, next);
    }
    return protectAdmin(req, res, () => requireRole("super_admin")(req, res, next));
});
router.route("/login").post(loginAdmin);
router.route("/logout").post(logoutAdmin)
export default router;