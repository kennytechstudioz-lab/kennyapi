import { Router } from 'express';
import * as faqController from '../controllers/faqController';

const router = Router();

router.get('/', faqController.getFaqs);
router.post('/', faqController.createFaq);
router.put('/:id', faqController.updateFaq);
router.delete('/:id', faqController.deleteFaq);

export default router;
