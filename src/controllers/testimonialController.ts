import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

const INITIAL_TESTIMONIALS = [
  {
    clientName: 'Jenny Wilson',
    clientRole: 'CEO, Urban Auto',
    picture: '',
    content: 'Kenny Tech Studios revamped our digital platform with incredible precision and speed. Our platform engagement and customer satisfaction skyrocketed within weeks.',
    rating: 5.0,
    clientProjectLink: 'https://kennytechstudios.com/projects',
  },
  {
    clientName: 'Bessie Cooper',
    clientRole: 'Product Lead, Horizon Logistics',
    picture: '',
    content: 'The IT security and custom software solutions delivered by the Kenny Tech team exceeded all our expectations. Truly a top-tier technology partner.',
    rating: 5.0,
    clientProjectLink: 'https://kennytechstudios.com/projects',
  },
  {
    clientName: 'Robert Fox',
    clientRole: 'Managing Director, Apex Cloud Solutions',
    picture: '',
    content: 'From initial architecture review to full production deployment, their engineering capability and prompt support have been exceptional.',
    rating: 5.0,
    clientProjectLink: 'https://kennytechstudios.com/projects',
  },
  {
    clientName: 'Jane Cooper',
    clientRole: 'Head of Engineering, PayFlow Global',
    picture: '',
    content: 'Collaborating with Kenny Tech transformed our infrastructure. Their proactive communication, quality code, and attention to detail are second to none.',
    rating: 5.0,
    clientProjectLink: 'https://kennytechstudios.com/projects',
  },
];

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    let testimonials = await Testimonial.find().sort({ createdAt: -1 });

    if (testimonials.length === 0) {
      testimonials = await Testimonial.insertMany(INITIAL_TESTIMONIALS);
    }

    res.status(200).json(testimonials);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { clientName, clientRole, picture, content, rating, clientProjectLink } = req.body;

    if (!clientName || !content) {
      return res.status(400).json({ message: 'Client name and content are required' });
    }

    const testimonial = await Testimonial.create({
      clientName,
      clientRole: clientRole || '',
      picture: picture || '',
      content,
      rating: rating ? Number(rating) : 5,
      clientProjectLink: clientProjectLink || '',
    });

    res.status(201).json(testimonial);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
