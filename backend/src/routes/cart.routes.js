import {Router} from "express";
import {
    addToCart,
    getUserCart,
    updateCart
} from "../controllers/cart.controller.js";
import authUser from "../middlewares/userAuth.middleware.js";

const router = Router();

//route to get the user's cart;
router.route("/get").post(
    authUser,
    getUserCart
);

//route to add items to user's cart
router.route("/add").post(
    authUser,
    addToCart
);

//route to update user's cart
router.route("/update").post(
    authUser,
    updateCart
);

export default router;