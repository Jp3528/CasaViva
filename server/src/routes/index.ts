import { Router } from 'express';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';
import authRoutes from './authRoutes';
import couponRoutes from './couponRoutes';
import reviewRoutes from './reviewRoutes';
import subscriberRoutes from './subscriberRoutes';
import chatRoutes from './chatRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/chat', chatRoutes);

// Healthcheck endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sistema: 'CasaViva E-Commerce API',
    hora: new Date().toISOString(),
    ambiente: process.env.NODE_ENV || 'development'
  });
});

export default router;
