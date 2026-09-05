import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  image: string;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  image: { type: String, required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
