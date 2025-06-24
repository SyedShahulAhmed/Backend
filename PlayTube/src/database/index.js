import mongoose from "mongoose"
import {DB_NAME}  from "../constants.js"

const conDb = async () =>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB Connected DB Host : ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB COnnection Error",error)
        process.exit(1)
    }
}

export default conDb;