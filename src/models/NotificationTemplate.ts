import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationTemplate extends Document {
  name: string;
  title: string;
  greetings: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationTemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  greetings: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<INotificationTemplate>('NotificationTemplate', NotificationTemplateSchema);
