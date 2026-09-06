import mongoose, { Schema, Document } from 'mongoose';

export interface IPosition extends Document {
  position: string;
  role?: string;
  duties?: string;
  rank: string;
  salary: number;
  createdAt: Date;
  updatedAt: Date;
}

const PositionSchema: Schema = new Schema(
  {
    position: { type: String, required: true, trim: true },
    role: { type: String, default: 'General' },
    duties: { type: String, default: 'General' },
    rank: { type: String, required: true, trim: true },
    salary: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPosition>('Position', PositionSchema);
