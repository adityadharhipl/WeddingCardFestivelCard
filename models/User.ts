// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor' | 'viewer' | 'user';
  isApproved: boolean;
  aiGenCount: number;
  isPremiumUser: boolean;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer', 'user'], default: 'user' },
  isApproved: { type: Boolean, default: false },
  aiGenCount: { type: Number, default: 0 },
  isPremiumUser: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Export a singleton model to avoid OverwriteModelError in hot reloads
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
