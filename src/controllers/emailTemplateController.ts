import { Request, Response } from 'express';
import EmailTemplate from '../models/EmailTemplate';

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching email templates' });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = new EmailTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: 'Error creating email template' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: 'Error updating email template' });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting email template' });
  }
};
