import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";

//Adding product;
const addProduct = asyncHandler(async(req, res) => {
    // getting the product details
    const {name, description, price, category, subCategory, sizes, bestSeller} = req.body;

    //getting images' multer file descriptor object instance
    const image1 = req.files.image1 && req.files?.image1[0];
    const image2 = req.files.image2 && req.files?.image2[0];
    const image3 = req.files.image3 && req.files?.image3[0];
    const image4 = req.files.image4 && req.files?.image4[0];

    //check the output once;
    if(!name||!description || !price || !category || !subCategory || !sizes)
    {
        throw new ApiError(400, "Some data is Missing");
    }
    
    //creating an array to store the cloudinary url of these images

    //this says create an array images from the given array of images after applying the filter method to the given array
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
    //now or url of  array
    let imagesUrl = await Promise.all(
        images.map(async(item) => {
            let resultUrl = await uploadOnCloudinary(item.path);
            return resultUrl.url;
        })
    );

    //creating a product model of the given data and storing it in db;
    const product = await Product.create({
        name,
        description,
        category,
        price: Number(price),
        subCategory,
        bestSeller: bestSeller === "true" ? true : false,
        sizes: JSON.parse(sizes),
        image: imagesUrl,
        date: Date.now(),
    });

    
    //checking the existence of the added product in db
    const createdProduct = await Product.findById(product._id);
    if(!createdProduct){
        throw new ApiError(400, "Failed to Add Product");
    }

    //if everything happens in perfectly 
    return res.status(201).json(
        new ApiResponse(
            200,
            null, 
            "Product Added Successfully"
        )
    )
    
});

//listing products
const listProducts = asyncHandler(async(req, res) =>{

});

//removing a product
const removeProduct = asyncHandler(async(req, res) =>{

});

//all information of a single product
const infoProduct = asyncHandler(async(req, res) =>{

});

export {
    addProduct,
    listProducts,
    removeProduct,
    infoProduct,
}