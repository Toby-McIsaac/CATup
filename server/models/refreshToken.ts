import mongoose, { Schema, Document } from 'mongoose';

interface IRefreshToken extends Document {
    userId: string;       // ID of the user this token belongs to
    tokenId: string;      // Unique identifier for the token
    createdAt: Date;      // When the token was issued
   // expiresAt: Date;      // Optional: set an expiration time for the token
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
    userId: { type: String, required: true },
    tokenId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    //expiresAt: { type: Date },
});

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;