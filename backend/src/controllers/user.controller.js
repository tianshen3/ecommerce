import { asyncHandler } from "../utils/asyncHandler.js";
//route for user registeration
const registerUser = asyncHandler(async(req, res) => {
    
    // //get user detail from frontend or postman which is present in req body 
    // const {fullName, email, username, password} = req.body;
    // console.log("Name :", fullName);
    // console.log("Username :", username);
    // console.log("Email:", email);
    // console.log("Password : ", password);

    // //validating the unwrapped data
    // //this says in the array if any field after trimming is empty then throw apierror
    // if([fullName, email, username, password].some((field) => field?.trim() === "")){
    //     throw new ApiError(400, "All fields required")
    // }

    console.log("api of gregisttartin wroking")
});

//route for user login
const loginUser = asyncHandler(async(req, res) => {

});

export {
    registerUser,
    loginUser,
};