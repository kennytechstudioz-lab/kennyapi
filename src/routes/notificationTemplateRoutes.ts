import { Router } from 'express';
import * as notificationTemplateController from '../controllers/notificationTemplateController';

const router = Router();

router.get('/', notificationTemplateController.getTemplates);
router.post('/', notificationTemplateController.createTemplate);
router.put('/:id', notificationTemplateController.updateTemplate);
router.delete('/:id', notificationTemplateController.deleteTemplate);

export default router;
