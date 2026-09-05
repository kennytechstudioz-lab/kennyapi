import { Router } from 'express';
import * as tutorialController from '../controllers/tutorialController';

const router = Router();

router.get('/', tutorialController.getTutorials);
router.post('/', tutorialController.createTutorial);
router.put('/:id', tutorialController.updateTutorial);
router.delete('/:id', tutorialController.deleteTutorial);

export default router;
