import {Router} from "express";
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
} from "../controllers/order.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { authUser } from "../middlewares/userAuth.middleware.js";

const router = Router();

//admin authorized routes
router.route("/list").post(
    adminAuth,
    allOrders
);

router.route("/status").post(
    adminAuth,
    updateStatus
);

//Payment Routes
router.route("/cod").post(
    authUser,
    placeOrder
);

router.route("/stripe").post(
    authUser,
    placeOrderStripe
);

router.route("/razorpay").post(
    authUser,
    placeOrderRazorpay
);

//User Order Detail Route
router.route("/userorders").post(
   authUser,   
   userOrders
);

export default router;


