import { Router } from 'express';
import {
  syncIncomingEmails,
  getEmails,
  getEmailById,
  replyEmail,
  sendEmail,
  toggleRead,
  deleteEmail,
} from '../controllers/emailController';

const router = Router();

// IMAP Synchronization
router.get('/sync', syncIncomingEmails);
router.post('/sync', syncIncomingEmails);

// Email CRUD & Actions
router.get('/', getEmails);
router.get('/:id', getEmailById);
router.post('/reply', replyEmail);
router.post('/send', sendEmail);
router.put('/:id/read', toggleRead);
router.delete('/:id', deleteEmail);

export default router;
