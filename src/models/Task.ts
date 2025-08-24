import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  name: string;
  description: string;
}

export const TaskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
