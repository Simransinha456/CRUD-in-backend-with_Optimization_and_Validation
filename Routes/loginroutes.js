import User from "../models/User.js";
import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const routes = express.Router();

// User registration
routes.post('/register', async (req, res) => { 
    try {
        const { username, password } = req.body;
        console.log(req.body)
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save(); //database me save kara rhe
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User login
routes.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'User does not exists' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: '"Password not matching' });
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { //token generate hoga
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default routes;