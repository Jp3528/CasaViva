import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';

const router = Router();

router.get('/producto/:productId', (req, res) => reviewController.getByProduct(req, res));
router.post('/crear', (req, res) => reviewController.addReview(req, res));

export default router;
