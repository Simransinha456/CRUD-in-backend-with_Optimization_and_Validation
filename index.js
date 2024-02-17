import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://simransinha280:Simransinha280@crud.rdjwr6r.mongodb.net/crud?retryWrites=true&w=majority");
        console.log("Connected to MongoDB.");
    } catch (error) {
        throw error;
    }
};
connect();

//POST---
app.post("/post", async (req, res) => {
    console.log("post function")

    const data = new User({
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
    })
    const val = await data.save();
    res.json(val); // here I'm getting all the values
    // res.send("posted"); // here it only give result posted
})

//PUT-----
app.put("/update/:id", async (req, res) => {
    try {
        let upid = req.params.id;
        let upfirstName = req.body.firstName;
        let uplastName = req.body.lastName;
        let upage = req.body.age;
        let upemail = req.body.email;

        const newUser = await User.findOneAndUpdate({ id: upid }, { $set: { firstName: upfirstName, lastName: uplastName, age: upage, email: upemail } }, { new: true });
        if (!newUser) {
            return res.status(404).send();
        } else {
            return res.send(newUser);
        }
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
})

//GET / FETCH-------------
app.get('/get/:id', async (req, res) => {
    try {
        const newUser = await User.findOne({ id: req.params.id });
        if (!newUser) {
            return res.status(404).send("User not found");
        } else {
            return res.send(newUser);
        }
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});


//DELETE -------
app.delete('/delete/:id', async (req, res) => {
    console.log("deleted");
    try {
        const newUser = await User.findOneAndDelete({ id: req.params.id });

        if (!newUser) {
            return res.status(404).send();
        } else {
            return res.send(newUser);
        }
    } catch (error) {
        res.send(error.message);
    }
})

app.listen(8000, () => {
    console.log("Server started on port 8000");
});
