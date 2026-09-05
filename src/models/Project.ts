import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  image: string;
  videoUrl?: string;
  description: string;
  category: string;
  staff: string;
  price: number;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  staff: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
