import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req,res)=>{
  try {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json("All fields are required");
    }

    const existing = await User.findOne({email});
    if(existing){
      return res.status(400).json("User already exists");
    }

    const hashed = await bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json(user);

  } catch(err){
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Login
router.post("/login", async (req,res)=>{
  try {
    const {email,password} = req.body;

    if(!email || !password){
      return res.status(400).json("All fields required");
    }

    const user = await User.findOne({email});
    if(!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id:user._id, role:user.role },
      process.env.JWT_SECRET,
      { expiresIn:"1d" }
    );

    res.cookie("token", token, {
      httpOnly:true,
      secure:true, // 🔥 IMPORTANT for Railway (HTTPS)
      sameSite:"none"
    });

    res.json({ message:"Login success" });

  } catch(err){
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Logout
router.post("/logout", (req,res)=>{
  res.clearCookie("token");
  res.json({ message:"Logged out" });
});

export default router;