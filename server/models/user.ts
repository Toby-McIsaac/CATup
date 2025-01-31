import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;