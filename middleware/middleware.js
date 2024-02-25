import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
const token = req.header('Authorization');
console.log(token); 

if (!token) 
{
    return res.status(401).json({ error: 'Access denied from token' });
}
try {
 const decoded = jwt.verify(token, 'your-secret-key');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: error.message });
 }
 };

 // You can use the code for protected routes here also or create another folder.. its upto you--

export default verifyToken;