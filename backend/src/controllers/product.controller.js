import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";

//Adding product;
const addProduct = asyncHandler(async(req, res) => {
    // getting the product details
    const {name, description, price, category, subCategory, sizes, bestseller} = req.body;

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
        bestseller: bestseller === "true" ? true : false,
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

    //this a type of get request of the all the products in the product collection of database
    const products = await Product.find({}).select(
        "-createdAt -updatedAt"
    );

    //checking the existence of this object
    if(!products){
        throw new ApiError(400, "Product collection is empty");
    }

    console.log(products);
    //returning a response
    return res.status(201).json(
        new ApiResponse(
            200,
            products,
            "This is the list of all the products in the database"
        )
    )
});

//removing a product
const removeProduct = asyncHandler(async(req, res) =>{

    //checking existence of the product
    const prodB = await Product.findById(req.body.id);
    if(!prodB)
    {
        throw new ApiError(400, "The Product does not exist");
    }

    //if the prodcut exists
    await Product.findByIdAndDelete(req.body.id);

    //check existence after deletion
    const prodA = await Product.findById(req.body.id);
    if(prodA){
        throw new ApiError(500, "Failed to delete the Product from the database");
    }

    //send success response
    return res.status(201).json(
        new ApiResponse(
            200,
            "",
            "Product Removed Successfully",
        )
    )
});

//all information of a single product
const infoProduct = asyncHandler(async(req, res) =>{

    //checking the existence of the product
    const { productId } = req.body;
    const prod = await Product.findById(productId);
    if(!prod){
        throw new ApiError(400, "Product does not exist");
    }

    //if exist send the response
    return res.status(201).json(
        new ApiResponse(
            200,
            prod,
            "Product information fetched successfully"
        )
    )
});

export {
    addProduct,
    listProducts,
    removeProduct,
    infoProduct,
}