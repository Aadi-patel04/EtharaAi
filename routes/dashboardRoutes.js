import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get tasks based on role
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(); // admin sees all tasks
    } else {
      tasks = await Task.find({ assignedTo: userId }); // member sees own tasks
    }

    const total = tasks.length;

    const completed = tasks.filter(t => t.status === "done").length;

    const pending = tasks.filter(t => t.status !== "done").length;

    const overdue = tasks.filter(
      t =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== "done"
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;