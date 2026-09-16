import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicy extends Document {
  category: 'terms' | 'privacy';
  title: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema: Schema = new Schema(
  {
    category: {
      type: String,
      enum: ['terms', 'privacy'],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPolicy>('Policy', PolicySchema);
