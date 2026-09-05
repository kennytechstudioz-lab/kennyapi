import { Router } from 'express';
import { getCompany, updateCompany } from '../controllers/companyController';

const router = Router();

router.get('/', getCompany);
router.put('/', updateCompany);

export default router;
