import { Router } from "express"; // ✅ Express Router
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  ChangePassword,
  getCurrentUser,
  getUserChannelProfile,
  updateAccount,
  updateAvatar,
  updateCoverImage,
  getWatchHistory,
} from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

//Unsecured routes

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

//secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").post(verifyJWT,ChangePassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)

router.route("/update-account").patch(verifyJWT,updateAccount)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)

router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)

router.route("/history").get(verifyJWT,getWatchHistory)

export default router;
