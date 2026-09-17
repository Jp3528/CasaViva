import { Router } from 'express';
import { chatbotController } from '../controllers/chatbotController';

const router = Router();
router.post('/mensaje', (req, res) => chatbotController.handleMessage(req, res));

export default router;
