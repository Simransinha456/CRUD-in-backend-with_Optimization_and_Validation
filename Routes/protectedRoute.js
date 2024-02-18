import express from "express";
import verifyToken from '../middleware/authMiddleware.js'; // Import verifyToken from authMiddleware.js

const router = express.Router();
// Protected route
router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

export default router; 
