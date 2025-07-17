import jwt from "jsonwebtoken";
import {User} from "../models/user.model"
import {ApiError} from "../utils/ApiError"
import {asynchandler} from "../utils/asyncHandler"

export const verifyJWT = asynchandler(async(req,_,next) =>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer","")

    if(!token){
        throw new ApiError(404,"UnAuthorized")
    }
    try {
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        await User.findById(decodedToken?._id).select("-password -refreshToken")
    req.user = user
    next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})