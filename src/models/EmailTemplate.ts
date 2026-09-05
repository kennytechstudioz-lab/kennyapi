import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  title: string;
  greetings: string;
  bannerImage: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  greetings: { type: String, required: true },
  bannerImage: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
