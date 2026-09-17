import { Request, Response } from 'express';
import Company from '../models/Company';

export const getCompany = async (req: Request, res: Response) => {
  try {
    let company = await Company.findOne();
    if (!company) {
      // Create a default one if it doesn't exist
      company = await Company.create({
        name: 'Kenny Tech Studios',
        domain: 'kennytech.com',
        email: 'info@kennytech.com',
        phoneNumber: '',
        address: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        linkedin: '',
        facebook: '',
        x: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        yearsExperience: '18+',
        completedJobs: '150+',
        clients: '2000+',
        customerSatisfaction: '99%',
      });
    } else {
      let needsUpdate = false;
      if (!company.yearsExperience) { company.yearsExperience = '18+'; needsUpdate = true; }
      if (!company.completedJobs) { company.completedJobs = '150+'; needsUpdate = true; }
      if (!company.clients) { company.clients = '2000+'; needsUpdate = true; }
      if (!company.customerSatisfaction) { company.customerSatisfaction = '99%'; needsUpdate = true; }
      if (needsUpdate) {
        await company.save();
      }
    }
    res.status(200).json(company);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    let company = await Company.findOne();
    if (company) {
      company = await Company.findByIdAndUpdate(company._id, req.body, { new: true });
    } else {
      company = await Company.create(req.body);
    }
    res.status(200).json(company);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
