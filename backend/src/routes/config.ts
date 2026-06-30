import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/config';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getConfig);
router.put('/', requireAdmin, updateConfig);

export default router;
