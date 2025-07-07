import { Router } from "express"; // ✅ Express Router
import { registerUser } from "../controllers/User.controller.js";
import {upload} from "../middlewares/multer.middlewares.js"
const router = Router();

router.route('/register').put(
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

export default router;
