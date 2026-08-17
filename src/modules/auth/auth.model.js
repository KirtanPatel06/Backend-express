import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 50,
        required: [true, "Name is required"],
    },

    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "email is required"]
    },

    password:{
        type: String,
        trim: true,
        minLength: 8,
        required: [true, "password is required"],
        select: false
    },
    role:{
        type: String,
        enum: ['customer', 'seller', 'admin'],
        default: 'customer'
    }
}, {timestamps: true});

export default mongoose.model("User", userSchema);