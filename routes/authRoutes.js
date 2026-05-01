import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req,res)=>{
  const {name,email,password} = req.body;

  const existing = await User.findOne({email});
  if(existing) return res.status(400).json("User already exists");

  const hashed = await bcrypt.hash(password,10);
  const user = await User.create({name,email,password:hashed});

  res.json(user);
});

// Login (COOKIE BASED)
router.post("/login", async (req,res)=>{
  const {email,password} = req.body;

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
    secure:false,
    sameSite:"lax"
  });

  res.json({ message:"Login success" });
});

// Logout
router.post("/logout", (req,res)=>{
  res.clearCookie("token");
  res.json({ message:"Logged out" });
});

export default router;