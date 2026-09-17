import { productRepository, ProductFilterOptions } from '../repositories/productRepository';
import { Product, ProductVariant } from '../models/types';

export class ProductService {
  public async getProducts(options: ProductFilterOptions) {
    return await productRepository.findAll(options);
  }

  public async getProductById(id: string): Promise<Product | null> {
    return await productRepository.findById(id);
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    return await productRepository.findBySlug(slug);
  }

  public async getFeaturedProducts(): Promise<Product[]> {
    return await productRepository.findFeatured();
  }

  public async getProductsUnder100(): Promise<Product[]> {
    return await productRepository.findUnder100();
  }

  public async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
    const { productos } = await productRepository.findAll({ categoria: categoryId, limite: 10 });
    return productos.filter(p => p.id !== productId).slice(0, limit);
  }

  public async getAdminProducts(): Promise<Product[]> {
    return await productRepository.getAllForAdmin();
  }

  public async updateProductPriceAndStatus(
    id: string,
    updates: { precio_base?: number; precio_anterior?: number; descuento_porcentaje?: number; estado?: any; activo?: boolean }
  ): Promise<Product | null> {
    if (updates.precio_base !== undefined && updates.precio_base <= 0) {
      throw new Error('El precio base debe ser mayor a 0');
    }
    return await productRepository.updateProduct(id, updates);
  }

  public async updateVariantStockAndPrice(
    variantId: string,
    updates: { stock?: number; precio_adicional?: number }
  ): Promise<ProductVariant | null> {
    if (updates.stock !== undefined && updates.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    return await productRepository.updateVariant(variantId, updates);
  }
}

export const productService = new ProductService();
