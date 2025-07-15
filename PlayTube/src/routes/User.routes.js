import { Router } from "express"; // ✅ Express Router
import { registerUser, logoutUser } from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middlewares.js"
const router = Router();

router.route('/register').post(
    upload.fields(
        [
            {
                name : "avatar",
                maxCount : 1,
            },
            {
                name : "coverImage",
                maxCount : 1,
            }
        ]
    ),
    registerUser);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)

export default router;
