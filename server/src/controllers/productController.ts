import { Request, Response } from 'express';
import { productService } from '../services/productService';

export class ProductController {
  public async getProducts(req: Request, res: Response) {
    try {
      const {
        categoria,
        marca,
        precioMin,
        precioMax,
        disponibilidad,
        busqueda,
        orden,
        pagina,
        limite
      } = req.query;

      const result = await productService.getProducts({
        categoria: categoria as string,
        marca: marca as string,
        precioMin: precioMin ? parseFloat(precioMin as string) : undefined,
        precioMax: precioMax ? parseFloat(precioMax as string) : undefined,
        disponibilidad: disponibilidad as any,
        busqueda: busqueda as string,
        orden: orden as any,
        pagina: pagina ? parseInt(pagina as string, 10) : 1,
        limite: limite ? parseInt(limite as string, 10) : 12
      });

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getProductBySlugOrId(req: Request, res: Response) {
    try {
      const { idOrSlug } = req.params;
      let product = await productService.getProductBySlug(idOrSlug);
      if (!product) {
        product = await productService.getProductById(idOrSlug);
      }

      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      res.json({ success: true, producto: product });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getFeatured(req: Request, res: Response) {
    try {
      const productos = await productService.getFeaturedProducts();
      res.json({ success: true, productos });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getUnder100(req: Request, res: Response) {
    try {
      const productos = await productService.getProductsUnder100();
      res.json({ success: true, productos });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getRelated(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { categoriaId } = req.query;
      const productos = await productService.getRelatedProducts(id, (categoriaId as string) || 'cat-sala');
      res.json({ success: true, productos });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getAdminProducts(req: Request, res: Response) {
    try {
      const productos = await productService.getAdminProducts();
      res.json({ success: true, productos });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async updateProductPriceAndStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { precio_base, precio_anterior, descuento_porcentaje, estado, activo } = req.body;
      const updated = await productService.updateProductPriceAndStatus(id, {
        precio_base: precio_base !== undefined ? parseFloat(precio_base) : undefined,
        precio_anterior: precio_anterior !== undefined ? parseFloat(precio_anterior) : undefined,
        descuento_porcentaje: descuento_porcentaje !== undefined ? parseInt(descuento_porcentaje, 10) : undefined,
        estado,
        activo
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      res.json({ success: true, producto: updated, message: 'Producto actualizado con éxito' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async updateVariantStock(req: Request, res: Response) {
    try {
      const { variantId } = req.params;
      const { stock, precio_adicional } = req.body;
      const updated = await productService.updateVariantStockAndPrice(variantId, {
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        precio_adicional: precio_adicional !== undefined ? parseFloat(precio_adicional) : undefined
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Variante no encontrada' });
      }

      res.json({ success: true, variante: updated, message: 'Stock y variante actualizados' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const productController = new ProductController();
