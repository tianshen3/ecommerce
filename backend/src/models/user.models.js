import mongoose, {Schema} from "mongoose";

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
        type: String,
        default: {}
    },
    refreshToken: {
        type: String, //expires early as compared to accesstoken
    }
}, 
{timestamps : true}, 
//mongodb generally ignores the property with empty data
//as in the case of cartData so in order to keep it we turn off the minimize property
{minimize: false});

export const User = mongoose.model("User", userSchema);