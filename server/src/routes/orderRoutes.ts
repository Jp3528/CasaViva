import { Router } from 'express';
import { orderController } from '../controllers/orderController';

const router = Router();

router.post('/calcular', (req, res) => orderController.calculateCart(req, res));
router.post('/crear', (req, res) => orderController.createOrder(req, res));
router.get('/admin/todos', (req, res) => orderController.getAllOrders(req, res));
router.get('/admin/metricas', (req, res) => orderController.getAdminStats(req, res));
router.patch('/admin/:id/estado', (req, res) => orderController.updateOrderStatus(req, res));
router.get('/usuario/:userId', (req, res) => orderController.getUserOrders(req, res));
router.get('/:idOrCode', (req, res) => orderController.getOrderDetails(req, res));

export default router;
