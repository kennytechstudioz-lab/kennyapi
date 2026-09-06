import { Router } from 'express';
import * as positionController from '../controllers/positionController';

const router = Router();

router.get('/', positionController.getPositions);
router.get('/:id', positionController.getPositionById);
router.post('/', positionController.createPosition);
router.put('/:id', positionController.updatePosition);
router.delete('/:id', positionController.deletePosition);

export default router;
