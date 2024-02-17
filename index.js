import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";
import env from "dotenv"

env.config()
const app = express();
// Middlewares
app.use(express.json());
app.use(cors());

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



//POST---
app.post("/create-friend", async (req, res) => {
    try {
        const friendData = req.body;
        if (!friendData?.id) {
            throw new Error("id is required");  // Manual validation
        }
        const newFriend = new User(friendData)

        const savedFriend = await newFriend.save(); // saving newFriend data in database
        res.send(savedFriend); // here I'm getting all the values(postman me check)
        // res.send("posted"); // here it only give result posted

    } catch (error) {
        // console.log(error)
        res.send({
            message: error.message // sending error message in response
        })
    }
})



//PUT-----
app.put("/update-friend/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const friendData = req.body;

        // Manual validation for age
        if (friendData?.age && (friendData.age < 18 || friendData.age > 100)) {
            throw new Error("Age must be between 18 and 100.");
        }

        // manual validation for email
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;   // email regex 
        if (friendData?.email) {
            const isEmail = friendData.email.match(emailFormat)
            if (!isEmail) throw new Error("Email should be in email format  ")
        }

        const updatedUser = await User.findByIdAndUpdate(id, friendData, { new: true });
        if (!updatedUser) {
            return res.status(404).send("error while updating");
        }
        return res.send(updatedUser);
    }
    catch (error) {
        console.log(error.message);
        res.send({ message: error.message });
    }
})



//GET / FETCH------------- when i wants to find that one id i can use get method
app.get('/friend/:id', async (req, res) => {
    try {
        const id = req.params.id
        const friend = await User.findById(id);
        // const email= req.query.email   // query ki help se email bhi check kar skte h(like id check krte hai waise hi)
        // const friend = await User.findOne({email});
        if (!friend) {
            return res.status(404).send("User not found");
        } else {
            return res.send(friend);
        }
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
});



//GET-ALL-- If all users exist then it will result all users name (check with postman)
app.get('/friends', async (req, res) => {
    try {
        const allFriends = await User.find();
        if (!allFriends || allFriends.length === 0) {
            return res.status(404).send("No users found");
        } else {
            return res.send({
                length: allFriends.length,
                friends: allFriends
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});



//DELETE -------
app.delete('/delete-friend/:id', async (req, res) => {
    try {
        const id = req.params.id
        // const deletedFriend = await User.findOneAndDelete({ id: req.params.id }); 
        const deletedFriend = await User.findByIdAndDelete(id); // by default id

        if (!deletedFriend) {
            return res.status(404).send({ message: "Can not delete friends or invalid id" });
        } else {
            return res.send({
                message: "friend delete successfully "
            });
        }
    } catch (error) {
        res.send(error.message);
    }
})

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

