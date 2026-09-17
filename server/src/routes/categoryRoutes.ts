import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';

const router = Router();
router.get('/', (req, res) => categoryController.getCategories(req, res));

export default router;
