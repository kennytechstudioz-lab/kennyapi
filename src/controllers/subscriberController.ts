import { Request, Response } from 'express';
import Subscriber from '../models/Subscriber';

// POST /api/subscribers
export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(409).json({
        status: 'already_subscribed',
        message: 'This email has already been subscribed to our newsletter.',
      });
      return;
    }

    await Subscriber.create({ email: email.toLowerCase().trim() });

    res.status(201).json({
      status: 'success',
      message: 'You have successfully subscribed to our newsletter and will be the first to receive our latest updates, tips, and exclusive offers!',
    });
  } catch (error: any) {
    // Handle mongoose duplicate key error (race condition)
    if (error.code === 11000) {
      res.status(409).json({
        status: 'already_subscribed',
        message: 'This email has already been subscribed to our newsletter.',
      });
      return;
    }
    res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
};

// GET /api/subscribers (admin use)
export const getSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      Subscriber.find().sort({ subscribedAt: -1 }).skip(skip).limit(limit),
      Subscriber.countDocuments(),
    ]);

    res.status(200).json({
      status: 'success',
      data: { docs, totalDocs, page, totalPages: Math.ceil(totalDocs / limit) },
    });
  } catch {
    res.status(500).json({ status: 'error', message: 'Failed to fetch subscribers.' });
  }
};
