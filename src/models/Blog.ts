import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  image: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  content: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', BlogSchema);
