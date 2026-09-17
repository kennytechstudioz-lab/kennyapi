import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  clientRole?: string;
  picture?: string;
  content: string;
  rating: number;
  clientProjectLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String, default: '' },
    picture: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    clientProjectLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
