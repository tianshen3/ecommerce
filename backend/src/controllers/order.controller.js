import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";

//global variables
const currency = 'usd';
const deliveryCharge = 10;

//intializing gateway
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const newOrder = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
        });

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    session.url,
                    "Stripe Payment Response"
                )
            )
    } catch (error) {
        console.log(error);
        throw ApiError(402, error.message);
    }
});

//verify stripe payment
const verifyStipe = asyncHandler(async (req, res) => {

    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await Order.findByIdAndUpdate(orderId, { payment: true });
            await User.findByIdAndUpdate(userId, { cartData: {} });

            //Add two ApiError for above awaits


            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "",
                        "Payment Status Changed Successfully"
                    )
                )
        }
        else {
            await Order.findByIdAndDelete(orderId);

            // here as well add and apierrror for not being able to delete teh order
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "",
                        "Payment Failed and Order Removed Successfully"
                    )
                )
        }
    } catch (error) {
        console.log(error);
    }
});

//place order using razorpay
const placeOrderRazorpay = asyncHandler(async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body;

        const newOrder = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
        });

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
            }
            else {
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            order,
                            "Payment Successfull via Razorpay"
                        )
                    )
            }
        });

    } catch (error) {
        console.log(error);
        throw new ApiError(400, error?.message);
    }

});

//verify razorpay payment
const verifyRazorpay = asyncHandler(async (req, res) => {

    try {
        const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify the payment signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Find the order by receipt (which is our order ID) and mark as paid
            await Order.findOneAndUpdate(
                { userId, paymentMethod: "Razorpay", payment: false },
                { payment: true },
                { sort: { date: -1 } }
            );
            await User.findByIdAndUpdate(userId, { cartData: {} });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "",
                        "Payment verified successfully"
                    )
                )
        } else {
            throw new ApiError(400, "Payment verification failed - invalid signature");
        }

    } catch (error) {
        console.log(error);
        throw new ApiError(400, error?.message);
    }
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

    const { userId } = req.body;

    //i am checking for all the orders made by this user
    //i am looking for all the documents in order collection which have userId equal to that of this user
    //there Order.find returns and array of all the relevant documents
    const orders = await Order.find({ userId });
    if (orders.length === 0) {
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

    const { orderId, status } = req.body;

    const updatedOrderInstance = await Order.findByIdAndUpdate(orderId, { status }, { returnDocument: "after" });
    if (updatedOrderInstance.status !== status) {
        throw new ApiError(400, "Status not updated");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedOrderInstance,
                "Status Updated Successfully"
            )
        )
});

export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStipe,
    verifyRazorpay
}