import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

//generating access and refresh tokens
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //we will use refreshToken to login user instead of credentials 
        //hence we will keep the refresh token in the user document till it expires which is long duration
        user.refreshToken = refreshToken;

        //since we have only created and updated refreshToken we need not validate or check the entire usermodel before saving
        //doing so will causer error because we are not saving the required fields
        await user.save({ validateBeforeSave : false});
        
        return {accessToken, refreshToken};

    } catch(error){
        
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }

}

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
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while creating new user");
    }

    //Upon Successfull Creation 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});

//route for user login
const loginUser = asyncHandler(async(req, res) => {
    //take the data from the user body
    const {username, email, password} = req.body;

    //check for the existence of username or email
    if(!(username && password)){
        throw new ApiError(400, "Username or Email is required");
    }

    //finding the user in the database and if not found throw an error  
    const user = await User.findOne({
        $or: [{username}, {email}]
    });
    if(!user){
        throw new ApiError(401, "User does not exist");
    }

    //if user of such credentials found then check whether the password matches or not
    //because this finds authority to access the user
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials");
    }

    //if password matches then generate tokens and send back the accessToken and keep the refreshToken in db
    //when called the generate function, the function ensures that the refreshToken is already stored in db
    const{accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    //creating a new user instance which is send as a response and is without password and refreshToken
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    );

    //sending the  tokens in the cookies
    const options = {
        httpOnly : true,
        secure : true
    }

    //finally a logged in response
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    );

});

export {
    registerUser,
    loginUser,
};