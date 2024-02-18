import express, { urlencoded } from "express";
import mongoose from "mongoose";
import env from "dotenv"
import userroute  from "./Routes/route.js";

env.config()
const app = express();
 
// Middlewares
app.use(express.json());
 
const mongoUrl = process.env.MONGO_URL;
// const connect = async () => {
//     try {
//         await mongoose.connect(mongoUrl);
//         console.log("Connected to MongoDB.");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// };
// connect(); 


//With self calling function-- called immediate invoke function
(async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
})();

// app.use("/", async(req, res, next)=>{
//     req.name = "deepak"
//     next();
// }) 

app.use("/",userroute);
app.listen(8000, () => {
    console.log("Server started on port 8000");
});



// Description-- 

//GET --
// 1. used to get/fetch/request data from the server
// 2. data is visible to everyone in the url
// 3. get requestremains in the browser history

//POST----
// 1. Post is used to submit the data to the server (we can create /update it also)
// 2. data is not displayed in the url that why it is secure also.
// 3. eg of post is (form sumbission)

//PUT--
// 1. put is used to update all the data

// PATHCH----
// 1. patch is used to apply specific update to the data (like particular data i want to update not all)

