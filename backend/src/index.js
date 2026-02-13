import dotenv from "dotenv";
dotenv.config({
    path: './env'
});

import { app } from "./app.js";
import connectDB from "./db/index.js";

//connectDB() returns a Promise which if success then , ".then " is executed 
//if failure then catch is executed
connectDB()
.then(() =>{
    //the server is listening at following ports for the req
    //if prod gives port use it or else use the development/local port
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>{
        console.log(`Server is Running at port: ${PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB Connection failed", error);
});