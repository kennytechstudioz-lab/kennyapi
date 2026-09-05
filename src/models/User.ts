import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  status: 'user' | 'staff' | 'admin';
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: {
      type: String,
      enum: ['user', 'staff', 'admin'],
      default: 'user',
    },
    position: {
      type: String,
      default: 'General Staff',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
