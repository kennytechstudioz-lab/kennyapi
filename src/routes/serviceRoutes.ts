import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

router.get('/', serviceController.getServices);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

export default router;
