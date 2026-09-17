import { Router } from 'express';
import { subscriberController } from '../controllers/subscriberController';

const router = Router();

router.post('/suscribir', (req, res) => subscriberController.subscribe(req, res));
router.get('/admin/todos', (req, res) => subscriberController.getAll(req, res));
router.get('/admin/logs-correos', (req, res) => subscriberController.getLogs(req, res));

export default router;
