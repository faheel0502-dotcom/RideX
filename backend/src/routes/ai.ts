import { Router } from 'express';
import { chatWithAssistant, compareProducts, recommendGear, recommendSize } from '../controllers/ai';

const router = Router();

router.post('/chat', chatWithAssistant);
router.post('/compare', compareProducts);
router.post('/recommend', recommendGear);
router.post('/size', recommendSize);

export default router;
