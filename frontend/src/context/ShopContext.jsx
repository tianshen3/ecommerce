import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

function ShopContextProvider(props) {

    const currency = "$";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");

    const navigate = useNavigate();


    //adding items to the cart
    const addToCart = async(itemId, size)=>{

        if(!size){
            toast.error("Select Product Size");
            return;
        }
        //to make a copy of object use structuredClone();
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] ={};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if(token){
            try {
                
                await axios.post(backendUrl+"/api/v1/cart/add",{itemId, size}, {headers : {token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    //for displaying as the subscript in the carticon of navbar
    function getCartCount(){
        let totalCount = 0;
        for(const items in cartItems)
        {
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item]>0)
                    {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }

        return totalCount;
    }

    //deleting from the cart
    const updateQuantity = async(itemId, size, quantity) =>{

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl+"/api/v1/cart/update", {itemId, size, quantity}, {headers: {token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }

        }
    }

    function getCartAmount(){
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items)
            
            if (!itemInfo) continue;
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item]>0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        return totalAmount;
    }

    const getProductsData = async()=>{
        try {            
            const response = await axios.get(backendUrl+ "/api/v1/product/listProducts");
            if(response.data.success){
                setProducts(response.data.data);
            }
            else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async(token)=>{
        try {
            
            const response = await axios.post(backendUrl+"/api/v1/cart/get",{}, {headers: {token}});
            if(response.data.success){
                setCartItems(response.data.data);
                
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(()=>{
        getProductsData();
    },[]);

    useEffect(()=>{
        if(!token && localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
        }
    },[]);
    
    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, setCartItems,
        updateQuantity, getCartAmount,
        navigate, backendUrl,
        token, setToken,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;