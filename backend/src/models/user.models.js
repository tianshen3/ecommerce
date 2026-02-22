import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    profilePhoto: {
        type: String, //cloudinary url
    },
    password: {
        type: String,
        required: [true, "Pasword is required"]
    },
    cartData: {
        type: Object,
        default: {},
    },
    refreshToken: {
        type: String, //expires early as compared to accesstoken
    }
}, 
{timestamps : true}, 
//mongodb generally ignores the property with empty data
//as in the case of cartData so in order to keep it we turn off the minimize property
{minimize: false});

//Mongoose "pre-save" middlerware hook for password encryption
userSchema.pre("save", async function() {
    //"this" is used to refer to current user document being saved
    //if password is not being modified return early
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

});

//Method to generate refresh token
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//Method to generate access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY            
        }
    )
}

//Method to check for the correct password
//async and await because this takes time to check the password sent and passwod present
//because of encryption and decryption
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
};

export const User = mongoose.model("User", userSchema);
//the User is a model created on the basis of the userSchema
//it is an object which knows, which collection in Mongodb it corresponds to(users) && what the scehma of a user looks like
//mongodb doesnt know about schema or validations it stores just json like documents