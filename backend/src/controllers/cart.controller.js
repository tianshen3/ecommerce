import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//adding product to user cart
const addToCart = asyncHandler(async(req, res)=>{

    const { userId, itemId, size} = req.body;

    const userData = await User.findById(userId);
    if(!userData)
    {
        throw new ApiError(400, "User does not exist");
    }

    let cartData = await userData.cartData;
    let qnt = 0;
    if(cartData[itemId])
    {
        if(cartData[itemId][size]){
            cartData[itemId][size] += 1;
            qnt = cartData[itemId][size];
        }
        else{
            cartData[itemId][size] = 1;
            qnt = 1;
        }
    }
    else{
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
        qnt = 1;
    }

    //checking the whether the quantity is updated or not;
    const aUser = await User.findByIdAndUpdate(userId, {cartData});
    const bUser = await User.findById(aUser._id);
    if(bUser.cartData[itemId][size]!=qnt){
        throw new ApiError(100, "Failed to Add Product to the Cart");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "",
                "Added to Cart"
            )
        );
});

//update user cart
const updateCart = asyncHandler(async(req, res)=>{

    const {userId, itemId, size, quantity} = req.body;

    const userData = await User.findById(userId);
    if(!userData)
    {
        throw new ApiError(400, "User does not exist");
    }

    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    //checking the whether the quantity is updated or not;
    const aUser = await User.findByIdAndUpdate(userId, {cartData});
    const bUser = await User.findById(aUser._id);
    if(bUser.cartData[itemId][size]!=quantity){
        throw new ApiError(100, "Failed to Update Quantity of the Item");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "",
                "Quantity Updated"
            )
        );

});

//get user cart data
const getUserCart = asyncHandler(async(req, res)=>{

    const {userId} = req.body;
     const userData = await User.findById(userId);
    if(!userData)
    {
        throw new ApiError(400, "User does not exist");
    }

    let cartData = await userData.cartData;
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                cartData,
                "Cart Data fetched successfully"
            )
        );

});

export{
    addToCart,
    updateCart,
    getUserCart
}