import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorhandler = (err,req,res,next) => {
    let error = err
    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500
    }
}

export {errorhandler}