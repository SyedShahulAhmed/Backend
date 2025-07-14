import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("No user Found");
      throw new ApiError(500, "User not found");
    }
    const accessToken = user.generateAccessToken;
    const refreshToken = user.generateRefreshToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somethign went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  //Validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are rqeuired");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(400, "User Already Exists!!");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is Required");
  }
  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // let coverImage = "";
  // if(coverImageLocalPath) {
  //     coverImage = await uploadOnCloudinary(coverImageLocalPath)
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar Uploaded");
  } catch (error) {
    console.log("Error while uploading avatar", error);
    throw new ApiError(500, "Failed to upload Avatar");
  }
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("CoverImage Uploaded");
  } catch (error) {
    console.log("Error while uploading coverImage", error);
    throw new ApiError(500, "Failed to upload coverImage");
  }
  try {
    const user = await User.create({
      fullname,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(500, "Something Went Wrong while registering User");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Register Successfully"));
  } catch (error) {
    console.log("User creation failed");
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(500, "Something went wrong and images deleted");
  }
});

const loginUser = asynchandler(async (req, res) => {
  //get data from body
  const { username, email, password } = req.body;

  //validation
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(500, "User not found");
  }
  //validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging In User");
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User loggedIn successfully"
      )
    );
});

const logoutUser = asynchandler(async(req,res) =>{
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set : {
          refreshToken : undefined,
        }
      },
      {
        new : true
      }
    )
    const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    };
    return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(20, {},"User logged out successfully"))
})

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
    };

    const { accessToken, refreshToken: newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .cookies("accessToken", accessToken, options)
      .cookies("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Access Token refreshed suceesfully"
        )
      );
  } catch (error) {
    throw new ApiError(500,"Something went wrong while refreshing access token")
  }
});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
    };
