import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
//route for user registeration
const registerUser = asyncHandler(async(req, res) => {
    
    //get user detail from frontend or postman which is present in req body 
    const {fullName, email, username, password} = req.body;
    console.log("Name :", fullName);
    console.log("Username :", username);
    console.log("Email:", email);
    console.log("Password : ", password);

    //validating the unwrapped data
    //this says in the array if any field after trimming is empty then throw apierror
    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields required")
    }

    //checking the existence of the user
    // this will take time since, it is checking in db and hence "await" keyword
    //mongoose converts given query object to a mongodb query
    //mongodb knows which collection to search becuase "User" model maps to "users" collection 
    //mongodb search the db and return a raw json 
    //this raw json is wrapped by mongoose
    const existedUser = await User.findOne({
        $or:[{ username }, { email }]
    });
    if(existedUser){
        throw new ApiError(409, "Username or Email, already exists");
    }

    //creating user using given properties and saving it
    //using await because it will take time for password hashing and storing in db
    //User.create method creates the user object and at the same time save it in db
    // "user" object is a Mongoose document instance representing the newly saved MongoDB document.
    const user = await User.create({
        username : username.toLowerCase(),
        email,
        fullName,
        profilePhoto : "",
        password,
    })

    //checking if the "user" is created succesfully in database or not
    //if yes then we will send this createdUser as response to the frontend
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //Upon Successfull Creation 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});

//route for user login
const loginUser = asyncHandler(async(req, res) => {

});

export {
    registerUser,
    loginUser,
};