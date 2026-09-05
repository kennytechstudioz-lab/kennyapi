import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { paginate } from '../utils/paginationHelper';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password || ''))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const query = { status: 'user' };
    const result = await paginate(User, req, query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffs = async (req: Request, res: Response) => {
  try {
    const query = { status: { $in: ['staff', 'admin'] } };
    const result = await paginate(User, req, query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, status, position } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, status, position },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkUpdateUserStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || !status) {
      return res.status(400).json({ message: 'Invalid bulk parameters' });
    }
    await User.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    res.json({ message: `Successfully updated ${ids.length} user statuses` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
