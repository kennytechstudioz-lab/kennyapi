import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq extends Document {
  category: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema: Schema = new Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IFaq>('Faq', FaqSchema);
