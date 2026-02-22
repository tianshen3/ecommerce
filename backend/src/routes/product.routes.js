import { Router } from "express";
import {
    addProduct,
    listProducts,
    removeProduct,
    infoProduct
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//product adding route
router.route("/addProduct").post(
    upload.fields([
        {
            name : "image1",
            maxCount : 1
        },
        {
            name : "image2",
            maxCount: 1,
        },
        {
            name : "image3",
            maxCount: 1,
        },
        {
            name : "image4",
            maxCount : 1,
        }
    ]),
    addProduct
);

//products listing route
router.route("/listProducts").get(listProducts);

//product removing route
router.route("/removeProduct").post(removeProduct);

//product information route
router.route("/infoProduct").post(infoProduct);

export default router;