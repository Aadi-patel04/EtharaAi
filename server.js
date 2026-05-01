import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true
}));



app.get("/ping", (req,res)=>{
  console.log("PING HIT");
  res.json({msg:"pong"});
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);


// ❗ IMPORTANT: Start server ONLY after DB connects
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");

    app.listen(PORT,"0.0.0.0", () => {
      console.log(`Server running on ${PORT}`);
    });

  })
  .catch(err => {
    console.error("DB Error:", err);
  });