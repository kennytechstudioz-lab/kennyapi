import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
}

const SubscriberSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
