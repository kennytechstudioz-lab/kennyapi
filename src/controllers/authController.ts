import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Position from '../models/Position';
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
      let role = user.role || user.duties || '';
      if (!role && user.position) {
        const posDoc = await Position.findOne({ position: { $regex: new RegExp(`^${user.position.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
        if (posDoc) role = posDoc.role || posDoc.duties || '';
      }
      if (!role && (user.position === 'General Staff' || !user.position)) {
        role = 'General';
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        position: user.position || 'General Staff',
        role: role,
        duties: role,
        picture: user.picture || '',
        quote: user.quote || '',
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
    const result = await paginate(User, req, query, { staffRank: 1, createdAt: 1 });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Public endpoint for home page team section — no auth required
export const getPublicTeam = async (req: Request, res: Response) => {
  try {
    const team = await User
      .find({ status: { $in: ['staff', 'admin'] } })
      .select('name position picture quote staffRank')
      .sort({ staffRank: 1, createdAt: 1 })
      .limit(12);
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let role = user.role || user.duties || '';
    if (!role && user.position) {
      const posDoc = await Position.findOne({ position: { $regex: new RegExp(`^${user.position.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
      if (posDoc) role = posDoc.role || posDoc.duties || '';
    }
    if (!role && (user.position === 'General Staff' || !user.position)) {
      role = 'General';
    }

    const userObj = user.toObject();
    userObj.role = role;
    userObj.duties = role;
    res.json(userObj);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, status, position, role, duties, picture, quote, address, staffRank } = req.body;
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (status !== undefined) updateFields.status = status;
    if (position !== undefined) updateFields.position = position;
    if (address !== undefined) updateFields.address = address;
    if (staffRank !== undefined) updateFields.staffRank = staffRank;
    if (picture !== undefined) updateFields.picture = picture;
    if (quote !== undefined) updateFields.quote = quote;
    if (role !== undefined) {
      updateFields.role = role;
      updateFields.duties = role;
    } else if (duties !== undefined) {
      updateFields.role = duties;
      updateFields.duties = duties;
    }

    // If position is provided without role/duties, auto-fetch role from Position
    if (position !== undefined && role === undefined && duties === undefined) {
      const posDoc = await Position.findOne({ position: { $regex: new RegExp(`^${position.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
      if (posDoc) {
        updateFields.role = posDoc.role || posDoc.duties || 'General';
        updateFields.duties = updateFields.role;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkUpdateUserStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status, position, role } = req.body;
    if (!ids || !Array.isArray(ids) || !status) {
      return res.status(400).json({ message: 'Invalid bulk parameters' });
    }
    const updateDoc: any = { status };
    if (position !== undefined) updateDoc.position = position;
    if (role !== undefined) {
      updateDoc.role = role;
      updateDoc.duties = role;
    } else if (status === 'staff') {
      updateDoc.position = position || 'General Staff';
      updateDoc.role = 'General';
      updateDoc.duties = 'General';
    }
    await User.updateMany(
      { _id: { $in: ids } },
      { $set: updateDoc }
    );
    res.json({ message: `Successfully updated ${ids.length} user statuses` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, newEmail } = req.body;
    const { id } = req.params;

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required to authorize changes' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has an existing password, check current password
    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
    }

    let emailUpdated = false;
    if (newEmail && typeof newEmail === 'string' && newEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      const targetEmail = newEmail.trim().toLowerCase();
      // Check if email already in use
      const existing = await User.findOne({ email: targetEmail, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'This email address is already in use by another account' });
      }
      user.email = targetEmail;
      emailUpdated = true;
    }

    let passwordUpdated = false;
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      passwordUpdated = true;
    }

    if (!emailUpdated && !passwordUpdated) {
      return res.status(400).json({ message: 'No changes provided for email or password' });
    }

    await user.save();

    let message = 'Credentials updated successfully';
    if (emailUpdated && passwordUpdated) {
      message = 'Email address and password updated successfully!';
    } else if (emailUpdated) {
      message = 'Email address updated successfully!';
    } else if (passwordUpdated) {
      message = 'Password updated successfully!';
    }

    res.json({ 
      success: true, 
      message,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        position: user.position,
        role: user.role,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

