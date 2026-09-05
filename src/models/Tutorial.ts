import mongoose, { Schema, Document } from 'mongoose';

export interface ITutorial extends Document {
  title: string;
  duration: string; // e.g. "4 Weeks", "10 Hours"
  price: number;
  image: string; // base64 string or URL
  instructor: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TutorialSchema: Schema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  instructor: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<ITutorial>('Tutorial', TutorialSchema);
