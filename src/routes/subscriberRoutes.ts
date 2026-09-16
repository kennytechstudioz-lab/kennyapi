import { Router } from 'express';
import { subscribe, getSubscribers } from '../controllers/subscriberController';

const router = Router();

router.post('/', subscribe);
router.get('/', getSubscribers);

export default router;
