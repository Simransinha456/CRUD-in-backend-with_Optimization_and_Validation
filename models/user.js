import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
export default User;
