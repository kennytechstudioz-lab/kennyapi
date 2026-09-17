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
  linkedin?: string;
  facebook?: string;
  x?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  yearsExperience?: string;
  completedJobs?: string;
  clients?: string;
  customerSatisfaction?: string;
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
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    x: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    yearsExperience: { type: String, default: '18+' },
    completedJobs: { type: String, default: '150+' },
    clients: { type: String, default: '2000+' },
    customerSatisfaction: { type: String, default: '99%' },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);
