import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create task
router.post("/", auth, async (req,res)=>{
  const task = await Task.create(req.body);
  res.json(task);
});

// Get tasks
router.get("/", auth, async (req,res)=>{
  const tasks = await Task.find();
  res.json(tasks);
});

// Update task
router.put("/:id", auth, async (req,res)=>{
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new:true }
  );
  res.json(task);
});

export default router;