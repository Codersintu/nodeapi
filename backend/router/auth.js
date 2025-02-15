const router=require("express").Router();
const { application } = require("express");
const User=require("../modle/userSchema")
const emailValidator = require('email-validator'); // For Node.js
const bcrypt=require("bcrypt")
//REGISTER
router.post("/register", async (req, res) => {
   try {
     //generate new password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
     //create new user
     const newUser = new User({
      fullName: req.body.fullName,
       email: req.body.email,
       password: hashedPassword,
     });
 
     //save user and respond
     const user = await newUser.save();
     res.status(200).json(user);
   } catch (err) {
     res.status(500).json(err)
   }
 });
 

//login
router.post("/login", async(req,res) => {
   try {
     const user = await User.findOne({ email: req.body.email });
     console.log(user)
     !user && res.status(404).json("user not found");
 
     const validPassword = await bcrypt.compare(req.body.password, user.password)
     !validPassword && res.status(400).json("wrong password")

    
     res.status(200).json(user)
   } catch (err) {
     res.status(500).json(err)
   }
 });

module.exports=router;