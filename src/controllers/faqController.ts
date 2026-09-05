import { Request, Response } from 'express';
import Faq from '../models/Faq';

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

export const createFaq = async (req: Request, res: Response) => {
  try {
    const faq = new Faq(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: 'Error creating FAQ' });
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: 'Error updating FAQ' });
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ' });
  }
};
