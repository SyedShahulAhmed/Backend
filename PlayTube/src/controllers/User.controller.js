import { asynchandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req,res) =>{
    const {fullname,email,username,password} = req.body

    //Validation
    if(
        [fullname,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are rqeuired")
    }
    const existedUser = await User.findOne({
        $or : [{email},{username}]
    })
    if(existedUser) {
        throw new ApiError(400,"User Already Exists!!")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is Required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = "";
    if(coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }
    const user = await User.create({
        fullname,
        email,
        username : username.toLowerCase(),
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500,"Something Went Wrong while registering User")
    }
    return res.status(201).json(new ApiResponse(200, createdUser,"User Register Successfully"))
})

export {
    registerUser
}