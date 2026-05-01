import mongoose from "mongoose";

export default mongoose.model("Project", new mongoose.Schema({
  title:String,
  description:String,
  createdBy:{ type:mongoose.Schema.Types.ObjectId, ref:"User" },
  members:[{ type:mongoose.Schema.Types.ObjectId, ref:"User" }]
}));