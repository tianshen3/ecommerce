import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 
const uploadOnCloudinary = async (localFilePath) => {
    try {
        //if local file path not found then just return 
        if(!localFilePath) return null;

        //cloudinary reads file from the disk using loaclFilePath
        //sends it to cloudinary servers, stores it and generate its url
        //cloudinary.uploader.upload() returns a promise that is resolves to JS object containing the metadata of uploaded file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        });

        //if file upload is successfull
        console.log("File is uploaded on Cloudinary: ", response.url);

        //this entire response object is returned to be used
        return response;

    } catch(error){
        console.error("Cloudinary upload failed : ", error.message);
        return null;
    } finally {
        //to delete the localFilePath 
        //fs.existsSync means pause execution and check whether a file exists at this path
        //if exists then delete it
        //sync is used because it helps free up resources
        //even though it stops further execcution till it happnes but the duration is small and neglible for a single file
        // and since all this happens within async so it really doesnt affect anything
        if(localFilePath && fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
    }
};

export {uploadOnCloudinary};