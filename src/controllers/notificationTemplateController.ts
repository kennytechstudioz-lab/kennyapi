import { Request, Response } from 'express';
import NotificationTemplate from '../models/NotificationTemplate';

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await NotificationTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification templates' });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = new NotificationTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: 'Error creating notification template' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const template = await NotificationTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification template' });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await NotificationTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification template' });
  }
};
