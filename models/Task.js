import mongoose from "mongoose";

export default mongoose.model("Task", new mongoose.Schema({
  title:String,
  description:String,
  projectId:{ type:mongoose.Schema.Types.ObjectId, ref:"Project" },
  assignedTo:{ type:mongoose.Schema.Types.ObjectId, ref:"User" },
  status:{ type:String, enum:["todo","in-progress","done"], default:"todo" },
  deadline:Date
}));