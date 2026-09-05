import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  domain: string;
  email: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    domain: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);
