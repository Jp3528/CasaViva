import { db } from './db';
import { Product, ProductVariant } from '../models/types';

export interface ProductFilterOptions {
  categoria?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  disponibilidad?: 'todos' | 'en_stock' | 'ofertas' | 'bajo_100';
  busqueda?: string;
  orden?: 'relevancia' | 'menor_precio' | 'mayor_precio' | 'nuevos' | 'calificacion';
  pagina?: number;
  limite?: number;
}

export class ProductRepository {
  public async findAll(options: ProductFilterOptions = {}): Promise<{ productos: Product[]; total: number; totalPaginas: number }> {
    let list = [...db.products.filter(p => p.activo)];

    // Filter by Category
    if (options.categoria && options.categoria !== 'todas') {
      list = list.filter(p => p.categoria_id === options.categoria || p.categoria_nombre?.toLowerCase() === options.categoria?.toLowerCase());
    }

    // Filter by Brand
    if (options.marca && options.marca !== 'todas') {
      list = list.filter(p => p.marca.toLowerCase() === options.marca?.toLowerCase());
    }

    // Filter by Price range
    if (options.precioMin !== undefined && !isNaN(options.precioMin)) {
      list = list.filter(p => p.precio_base >= options.precioMin!);
    }
    if (options.precioMax !== undefined && !isNaN(options.precioMax)) {
      list = list.filter(p => p.precio_base <= options.precioMax!);
    }

    // Filter by Availability / Features
    if (options.disponibilidad === 'en_stock') {
      list = list.filter(p => p.variantes.some(v => v.stock > 0));
    } else if (options.disponibilidad === 'ofertas') {
      list = list.filter(p => (p.descuento_porcentaje || 0) > 0 || p.estado === 'Oferta');
    } else if (options.disponibilidad === 'bajo_100') {
      list = list.filter(p => p.precio_base <= 100);
    }

    // Search query
    if (options.busqueda && options.busqueda.trim() !== '') {
      const q = options.busqueda.toLowerCase().trim();
      list = list.filter(p => 
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.descripcion_corta.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (options.orden === 'menor_precio') {
      list.sort((a, b) => a.precio_base - b.precio_base);
    } else if (options.orden === 'mayor_precio') {
      list.sort((a, b) => b.precio_base - a.precio_base);
    } else if (options.orden === 'nuevos') {
      list.sort((a, b) => (b.estado === 'Nuevo' ? 1 : 0) - (a.estado === 'Nuevo' ? 1 : 0));
    } else if (options.orden === 'calificacion') {
      list.sort((a, b) => b.calificacion_promedio - a.calificacion_promedio);
    }

    const total = list.length;
    const limite = options.limite || 12;
    const pagina = options.pagina || 1;
    const totalPaginas = Math.ceil(total / limite) || 1;
    const inicio = (pagina - 1) * limite;
    const productos = list.slice(inicio, inicio + limite);

    return { productos, total, totalPaginas };
  }

  public async findById(id: string): Promise<Product | null> {
    const prod = db.products.find(p => p.id === id);
    return prod ? JSON.parse(JSON.stringify(prod)) : null;
  }

  public async findBySlug(slug: string): Promise<Product | null> {
    const prod = db.products.find(p => p.slug === slug || p.id === slug);
    return prod ? JSON.parse(JSON.stringify(prod)) : null;
  }

  public async findFeatured(): Promise<Product[]> {
    return db.products.filter(p => p.destacado && p.activo);
  }

  public async findUnder100(): Promise<Product[]> {
    return db.products.filter(p => p.precio_base <= 100 && p.activo);
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    db.products[index] = {
      ...db.products[index],
      ...updates
    };

    // If PostgreSQL connected, also run SQL update
    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          `UPDATE productos 
           SET precio_base = COALESCE($1, precio_base),
               precio_anterior = COALESCE($2, precio_anterior),
               descuento_porcentaje = COALESCE($3, descuento_porcentaje),
               estado = COALESCE($4, estado),
               activo = COALESCE($5, activo),
               actualizado_en = CURRENT_TIMESTAMP
           WHERE id = $6`,
          [
            updates.precio_base,
            updates.precio_anterior,
            updates.descuento_porcentaje,
            updates.estado,
            updates.activo,
            id
          ]
        );
      } catch (err) {
        console.error('Error actualizando producto en PostgreSQL:', err);
      }
    }

    return JSON.parse(JSON.stringify(db.products[index]));
  }

  public async updateVariant(variantId: string, updates: Partial<ProductVariant>): Promise<ProductVariant | null> {
    let updatedVariant: ProductVariant | null = null;

    for (const prod of db.products) {
      const vIndex = prod.variantes.findIndex(v => v.id === variantId);
      if (vIndex !== -1) {
        prod.variantes[vIndex] = {
          ...prod.variantes[vIndex],
          ...updates
        };
        updatedVariant = prod.variantes[vIndex];
        break;
      }
    }

    if (db.isPostgresConnected && db.pool && updatedVariant) {
      try {
        await db.pool.query(
          `UPDATE variantes_producto
           SET stock = COALESCE($1, stock),
               precio_adicional = COALESCE($2, precio_adicional)
           WHERE id = $3`,
          [updates.stock, updates.precio_adicional, variantId]
        );
      } catch (err) {
        console.error('Error actualizando variante en PostgreSQL:', err);
      }
    }

    return updatedVariant;
  }

  public async getAllForAdmin(): Promise<Product[]> {
    // Return base products, each containing its list of variants
    return JSON.parse(JSON.stringify(db.products));
  }
}

export const productRepository = new ProductRepository();
