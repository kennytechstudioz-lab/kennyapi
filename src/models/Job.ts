import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  name: string;
  domain?: string;
  price: number;
  duration: string; // e.g. "3 Weeks", "2 Months"
  type: 'Web App' | 'Mobile App' | 'Video Editing' | 'Digital Marketing' | 'Animation' | 'Other';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema({
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientEmail: { type: String, required: true },
  name: { type: String, required: true },
  domain: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Web App', 'Mobile App', 'Video Editing', 'Digital Marketing', 'Animation', 'Other']
  },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);
