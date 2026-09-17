import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/registro', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/recuperar-password', (req, res) => authController.recoverPassword(req, res));
router.get('/perfil/:userId', (req, res) => authController.getProfile(req, res));
router.get('/direcciones/:userId', (req, res) => authController.getAddresses(req, res));
router.post('/direcciones/:userId', (req, res) => authController.addAddress(req, res));
router.delete('/direcciones/:userId/:addressId', (req, res) => authController.deleteAddress(req, res));
router.patch('/direcciones/:userId/:addressId/default', (req, res) => authController.setDefaultAddress(req, res));

export default router;
