import { apiRequest } from './api';
import { Product, Category, ProductVariant } from '../types';

export interface ProductFiltersQuery {
  categoria?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  disponibilidad?: string;
  busqueda?: string;
  orden?: string;
  pagina?: number;
  limite?: number;
}

export const productService = {
  async getProducts(params: ProductFiltersQuery = {}): Promise<{ productos: Product[]; total: number; totalPaginas: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiRequest(`/products?${query.toString()}`);
  },

  async getProductBySlugOrId(idOrSlug: string): Promise<{ producto: Product }> {
    return apiRequest(`/products/${idOrSlug}`);
  },

  async getFeaturedProducts(): Promise<{ productos: Product[] }> {
    return apiRequest('/products/destacados');
  },

  async getProductsUnder100(): Promise<{ productos: Product[] }> {
    return apiRequest('/products/bajo-100');
  },

  async getRelatedProducts(id: string, categoriaId: string): Promise<{ productos: Product[] }> {
    return apiRequest(`/products/relacionados/${id}?categoriaId=${categoriaId}`);
  },

  async getCategories(): Promise<{ categorias: Category[] }> {
    return apiRequest('/categories');
  },

  async getAdminProducts(): Promise<{ productos: Product[] }> {
    return apiRequest('/products/admin/catalogo');
  },

  async updateProductPriceAndStatus(
    id: string,
    updates: { precio_base?: number; precio_anterior?: number; descuento_porcentaje?: number; estado?: any; activo?: boolean }
  ): Promise<{ producto: Product; message: string }> {
    return apiRequest(`/products/admin/producto/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async updateVariantStock(
    variantId: string,
    updates: { stock?: number; precio_adicional?: number }
  ): Promise<{ variante: ProductVariant; message: string }> {
    return apiRequest(`/products/admin/variante/${variantId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};
