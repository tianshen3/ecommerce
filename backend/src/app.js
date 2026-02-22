import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// creating an instance of the express 
const app = express();

//applying cors to only allow the permitted frontends to connect to this backend
//cors is function which is called as cors() and object is passed as a configration
//in this object there is origin  "the allowed frontends"
//a bool credential which says cookies can flow from the client to server
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true,
}));

//limiting the accepted json size 
app.use(express.json({
    limit: "16kb",
}));

//allowing the inforamation from the url and the limiting its size
app.use(express.urlencoded({
    extended : true,
    limit : "16kb",
}));

//allowing access from the public folder
app.use(express.static("public"));

//gain access to cookies and allow the transfer of access and refresh token to the frontend from the user controller
app.use(cookieParser());

//api endpoints
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";


app.use("/api/v1/users", userRouter)
app.use("/api/v1/product", productRouter)

export {app};