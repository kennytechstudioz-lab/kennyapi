import { Router } from 'express';
import * as policyController from '../controllers/policyController';

const router = Router();

router.get('/', policyController.getPolicies);
router.post('/seed', policyController.seedPolicies);
router.post('/', policyController.createPolicy);
router.put('/:id', policyController.updatePolicy);
router.delete('/:id', policyController.deletePolicy);

export default router;
