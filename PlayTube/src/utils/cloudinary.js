import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from 'dotenv'

dotenv.config()
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response =  await cloudinary.uploader.upload(
            localFilePath, {
                resource_type : "auto",
            }
        )
        console.log("File Uploaded on cloudinary> file src : " + response.url)
        //once file is Uploaded , we would like to delete it from our server
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
 }
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from cloudniary" , publicId)
    } catch (error) {
        console.log("Error Deleting from cloudinary" , error)
    }
}
 export {uploadOnCloudinary,deleteFromCloudinary}