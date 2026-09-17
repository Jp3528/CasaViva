import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

router.get('/', (req, res) => productController.getProducts(req, res));
router.get('/destacados', (req, res) => productController.getFeatured(req, res));
router.get('/bajo-100', (req, res) => productController.getUnder100(req, res));
router.get('/admin/catalogo', (req, res) => productController.getAdminProducts(req, res));
router.get('/relacionados/:id', (req, res) => productController.getRelated(req, res));
router.get('/:idOrSlug', (req, res) => productController.getProductBySlugOrId(req, res));
router.patch('/admin/producto/:id', (req, res) => productController.updateProductPriceAndStatus(req, res));
router.patch('/admin/variante/:variantId', (req, res) => productController.updateVariantStock(req, res));

export default router;
