import { Router } from express;
import {
    addProduct,
    listProducts,
    removeProduct,
    infoProduct
} from "../controllers/product.controller.js";

const router = Router();

//product adding route
router.route("/addProduct").post(addProduct);

//products listing route
router.route("/listProducts").get(listProducts);

//product removing route
router.route("/removeProduct").post(removeProduct);

//product information route
router.route("/infoProduct").post(infoProduct);

export default router;