import express from "express"
import User from "../models/Friend.js";
import verifyToken from "../middleware/middleware.js";

const route = express.Router()

//POST---
route.post("/create-friend",verifyToken, async (req, res) => {
    try {
        const friendData = req.body; // we are getting data here from user.js
        // if (!friendData?.id) { // here this will not required bcz here you are creating new friend
        //     throw new Error("id is required");  //Manual validation
        // }
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

//isme token generate ho rha hai login se jo dusra project me hai .. agr ham chahte hai ki yhi se token generate kar paaye to isme hme bcrypt and jwt ka use krna hoga post route me 


//PUT-----
route.put("/update-friend/:id",verifyToken, async (req, res) => {
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
        res.send({ message: error.message });
    }
})



//GET / FETCH------------- when i wants to find that one id i can use get method
route.get('/friend/:id', verifyToken,async (req, res) => {
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
route.get('/friends', verifyToken, async (req, res) => {
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
route.delete('/delete-friend/:id', verifyToken, async (req, res) => { 
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

export default route;