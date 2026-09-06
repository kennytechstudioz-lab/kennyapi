import express from 'express';
import { 
  register, 
  login, 
  getUsers, 
  getUserById,
  deleteUser, 
  getStaffs, 
  updateUser, 
  bulkUpdateUserStatus,
  changePassword 
} from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.get('/staffs', getStaffs);
router.put('/users/bulk-status', bulkUpdateUserStatus);
router.put('/users/:id', updateUser);
router.put('/users/:id/password', changePassword);

export default router;
