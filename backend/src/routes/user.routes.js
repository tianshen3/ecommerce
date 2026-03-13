import { Router } from "express";
import {
    registerUser,
    loginUser,
    adminLogin
} from "../controllers/user.controller.js";

const router = Router();

//in registeration route first check for the Profile Photo using Multer Middlerware and store it locally,
//then hit the registerUser function
router.route("/register").post(registerUser);

//login route
router.route("/login").post(loginUser);

//adminlogin route
router.route("/adminLogin").post(adminLogin);

export default router;