import { Request, Response } from 'express';
import Position from '../models/Position';
import User from '../models/User';

export const getPositions = async (req: Request, res: Response) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching positions', error: error.message });
  }
};

export const getPositionById = async (req: Request, res: Response) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json(position);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching position', error: error.message });
  }
};

export const createPosition = async (req: Request, res: Response) => {
  try {
    const { position, role, duties, rank, salary } = req.body;
    const finalRole = role || duties || 'General';
    if (!position || !rank || salary === undefined) {
      return res.status(400).json({ message: 'Position, rank, and salary are required' });
    }

    const newPosition = new Position({
      position,
      role: finalRole,
      duties: finalRole,
      rank,
      salary: Number(salary),
    });

    await newPosition.save();
    res.status(201).json(newPosition);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating position', error: error.message });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  try {
    const original = await Position.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Position not found' });

    const updatePayload = { ...req.body };
    if (req.body.role && !req.body.duties) {
      updatePayload.duties = req.body.role;
    } else if (req.body.duties && !req.body.role) {
      updatePayload.role = req.body.duties;
    }

    const updated = await Position.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!updated) return res.status(404).json({ message: 'Position not found' });

    // Sync updated role/duties and title to all users assigned this position
    if (updatePayload.role !== undefined || updatePayload.duties !== undefined || updatePayload.position !== undefined) {
      const newRole = updated.role || updated.duties || 'General';
      await User.updateMany(
        { position: original.position },
        { 
          $set: { 
            position: updated.position,
            role: newRole,
            duties: newRole 
          } 
        }
      );
    }

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating position', error: error.message });
  }
};

export const deletePosition = async (req: Request, res: Response) => {
  try {
    const deleted = await Position.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Position not found' });
    res.json({ message: 'Position deleted successfully', position: deleted });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting position', error: error.message });
  }
};
