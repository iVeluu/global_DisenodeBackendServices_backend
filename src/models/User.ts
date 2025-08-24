import mongoose, { Schema, Document } from "mongoose";

export enum EnumRoles {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  image?: string;
  role: EnumRoles;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(EnumRoles),
      default: EnumRoles.USER,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", userSchema);
export default User;
