import { Router } from 'express';
import { couponController } from '../controllers/couponController';

const router = Router();

router.post('/validar', (req, res) => couponController.validate(req, res));
router.get('/', (req, res) => couponController.getAll(req, res));
router.post('/admin/crear', (req, res) => couponController.create(req, res));
router.patch('/admin/:id/estado', (req, res) => couponController.toggle(req, res));

export default router;
