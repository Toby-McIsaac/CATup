import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	id: string;
}

const UserSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	id: { type: String, required: true, unique: true },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;