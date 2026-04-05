import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

//generating access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //we will use refreshToken to login user instead of credentials 
        //hence we will keep the refresh token in the user document till it expires which is long duration
        user.refreshToken = refreshToken;

        //since we have only created and updated refreshToken we need not validate or check the entire usermodel before saving
        //doing so will causer error because we are not saving the required fields
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {

        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }

}

//route for user registeration
const registerUser = asyncHandler(async (req, res) => {

    //get user detail from frontend or postman which is present in req body 
    const { fullName, email, password } = req.body;
    console.log("Name :", fullName);
    console.log("Email:", email);
    console.log("Password : ", password);

    //validating the unwrapped data
    //this says in the array if any field after trimming is empty then throw apierror
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields required")
    }

    //checking the existence of the user
    // this will take time since, it is checking in db and hence "await" keyword
    //mongoose converts given query object to a mongodb query
    //mongodb knows which collection to search becuase "User" model maps to "users" collection 
    //mongodb search the db and return a raw json 
    //this raw json is wrapped by mongoose
    const existedUser = await User.findOne(
        { email }
    );
    if (existedUser) {
        throw new ApiError(409, "Email, already exists");
    }

    //creating user using given properties and saving it
    //using await because it will take time for password hashing and storing in db
    //User.create method creates the user object and at the same time save it in db
    // "user" object is a Mongoose document instance representing the newly saved MongoDB document.
    const user = await User.create({
        // username: username.toLowerCase(),
        email,
        fullName,
        profilePhoto: "",
        password,
        cartData: {},
    })

    //checking if the "user" is created succesfully in database or not
    //if yes then we will send this createdUser as response to the frontend
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating new user");
    }

    //generating token so the user is automatically logged in after registration
    const { accessToken } = await generateAccessAndRefreshToken(user._id);

    //Upon Successfull Creation — return token so frontend can store it
    return res.status(201).json(
        new ApiResponse(200, { token: accessToken }, "User Registered Successfully")
    );
});

//route for user login
const loginUser = asyncHandler(async (req, res) => {
    //take the data from the user body
    const { email, password } = req.body;

    //check for the existence of username or email
    if (!(email && password)) {
        throw new ApiError(400, "Username or Email is required");
    }

    //finding the user in the database and if not found throw an error  
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new ApiError(401, "User does not exist");
    }

    //if user of such credentials found then check whether the password matches or not
    //because this finds authority to access the user
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    //if password matches then generate tokens and send back the accessToken and keep the refreshToken in db
    //when called the generate function, the function ensures that the refreshToken is already stored in db
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


    //finally a logged in response — return token in same format as register
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    token: accessToken
                },
                "User logged in Successfully"
            )
        );

});

//route for admin login
const adminLogin = asyncHandler(async (req, res) => {

    //take info from request body
    const { email, password } = req.body

    //checking the existence of the username or email
    if (!(email && password)) {
        throw new ApiError(400, "adminEmail and adminPassword is required");
    }

    //checking if these username or email match the enviroment variables
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(email + password, process.env.ACCESS_TOKEN_SECRET);
        return res.status(201)
            .json(
                new ApiResponse(
                    200,
                    token,
                    "Admin Authentication token generated successfully"
                )
            );
    }
    else {
        throw new ApiError(400, "admin credentials do not match");
    }
});

export {
    registerUser,
    loginUser,
    adminLogin
};