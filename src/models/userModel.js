import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashPassword: { type: String, required: true, minLength: 6 },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
},
    { timestamps: true });

const User = mongoose.model("User", userSchema)

export default User;