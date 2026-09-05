import express from 'express';
import { 
  register, 
  login, 
  getUsers, 
  deleteUser, 
  getStaffs, 
  updateUser, 
  bulkUpdateUserStatus 
} from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/staffs', getStaffs);
router.put('/users/bulk-status', bulkUpdateUserStatus);
router.put('/users/:id', updateUser);

export default router;
