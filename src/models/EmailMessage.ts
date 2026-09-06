import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailMessage extends Document {
  messageId?: string;
  uid?: number;
  from: string;
  fromName?: string;
  to: string[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'trash' | 'archive';
  inReplyTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailMessageSchema: Schema = new Schema(
  {
    messageId: {
      type: String,
      sparse: true,
      index: true,
    },
    uid: {
      type: Number,
      index: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    fromName: {
      type: String,
      default: '',
    },
    to: {
      type: [String],
      default: [],
    },
    subject: {
      type: String,
      default: '(No Subject)',
      trim: true,
    },
    bodyText: {
      type: String,
      default: '',
    },
    bodyHtml: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    folder: {
      type: String,
      enum: ['inbox', 'sent', 'trash', 'archive'],
      default: 'inbox',
      index: true,
    },
    inReplyTo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast folder listing and sorting
EmailMessageSchema.index({ folder: 1, date: -1 });

export default mongoose.model<IEmailMessage>('EmailMessage', EmailMessageSchema);
