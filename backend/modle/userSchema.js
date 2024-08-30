const { Schema, model } = require("mongoose");
const jwtToken=require("jsonwebtoken")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'fullName is required'],
        minlength: [5, 'fullName must be at least 5 characters'],
        maxlength: [50, 'fullName should be less than 50 characters'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        index: true  // Optional indexing
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [8, 'password must be at least 8 characters'],
        select: false
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {  // Corrected the typo
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type: Number,
        enum:[1,2,3] 
    }
}, {
    timestamps: true
});

const User =model('user', userSchema);
module.exports = User;
