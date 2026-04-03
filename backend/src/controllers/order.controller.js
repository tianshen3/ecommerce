import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//placing order using COD
const placeOrder = asyncHandler(async (req, res) => {

    const { userId, items, amount, address } = req.body;


    const newOrder = await Order.create({
        userId,
        items,
        address,
        amount,
        paymentMethod: "COD",
        payment: false,
    });

    const checkOrder = await Order.findById(newOrder._id);
    if (!checkOrder) {
        throw new ApiError(400, "Order couldn't be placed");
    }
    else {
        await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "",
                "Order placed Successfully"
            )
        )
});

//place order using Stripe
const placeOrderStripe = asyncHandler(async (req, res) => {

});

//place order using razorpay
const placeOrderRazorpay = asyncHandler(async (req, res) => {

});

//order data for admin panel
const allOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({});
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                orders,
                "All orders fetched successfully"
            )
        )
});

//order data for a particular user
const userOrders = asyncHandler(async (req, res) => {

    const {userId} = req.body;

    //i am checking for all the orders made by this user
    //i am looking for all the documents in order collection which have userId equal to that of this user
    //there Order.find returns and array of all the relevant documents
    const orders = await Order.find({userId});
    if(orders.length===0){
        throw new ApiError(400, "No orders exist");
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                orders,
                "Order fetched successfully"
            )
        )


});

//updating order status from admin panel for a particular user
const updateStatus = asyncHandler(async (req, res) => {

});

export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
}