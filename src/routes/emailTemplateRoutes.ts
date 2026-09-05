import { Router } from 'express';
import * as emailTemplateController from '../controllers/emailTemplateController';

const router = Router();

router.get('/', emailTemplateController.getTemplates);
router.post('/', emailTemplateController.createTemplate);
router.put('/:id', emailTemplateController.updateTemplate);
router.delete('/:id', emailTemplateController.deleteTemplate);

export default router;
