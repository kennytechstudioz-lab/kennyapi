import { Request, Response } from 'express';
import Blog from '../models/Blog';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error?.message || 'Error fetching blogs' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error: any) {
    console.error('Error creating blog:', error);
    res.status(400).json({ message: error?.message || 'Error creating blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error: any) {
    console.error('Error updating blog:', error);
    res.status(400).json({ message: error?.message || 'Error updating blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: error?.message || 'Error deleting blog' });
  }
};
