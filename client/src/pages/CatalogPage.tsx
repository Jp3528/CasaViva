import React, { useState, useEffect, useMemo } from 'react';
import { productService, ProductFiltersQuery } from '../services/productService';
import { Product, Category } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface CatalogPageProps {
  initialFilter?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ initialFilter = '', onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<ProductFiltersQuery>(() => {
    const init: ProductFiltersQuery = {
      pagina: 1,
      limite: 12,
      orden: 'relevancia',
    };

    if (initialFilter) {
      if (initialFilter.startsWith('categoria=')) {
        const cat = initialFilter.replace('categoria=', '');
        if (cat === 'bajo_100') {
          init.disponibilidad = 'bajo_100';
        } else if (cat === 'ofertas') {
          init.disponibilidad = 'ofertas';
        } else {
          init.categoria = cat;
        }
      } else if (initialFilter.startsWith('busqueda=')) {
        init.busqueda = decodeURIComponent(initialFilter.replace('busqueda=', ''));
      }
    }
    return init;
  });

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res.categorias || []);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  // Update filters if initialFilter changes externally
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.startsWith('categoria=')) {
        const cat = initialFilter.replace('categoria=', '');
        if (cat === 'bajo_100') {
          setFilters(prev => ({ ...prev, categoria: undefined, disponibilidad: 'bajo_100', pagina: 1 }));
        } else if (cat === 'ofertas') {
          setFilters(prev => ({ ...prev, categoria: undefined, disponibilidad: 'ofertas', pagina: 1 }));
        } else {
          setFilters(prev => ({ ...prev, categoria: cat, disponibilidad: undefined, pagina: 1 }));
        }
      } else if (initialFilter.startsWith('busqueda=')) {
        const q = decodeURIComponent(initialFilter.replace('busqueda=', ''));
        setFilters(prev => ({ ...prev, busqueda: q, pagina: 1 }));
      }
    }
  }, [initialFilter]);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProducts(filters);
        setProducts(res.productos || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPaginas || 1);
      } catch (err) {
        console.error('Error obteniendo productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ProductFiltersQuery>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      pagina: 1,
      limite: 12,
      orden: 'relevancia',
      categoria: undefined,
      marca: undefined,
      precioMin: undefined,
      precioMax: undefined,
      disponibilidad: undefined,
      busqueda: undefined,
    });
  };

  const brands = useMemo(() => {
    return ['CasaViva Studio', 'Nórdica Home', 'Lino & Madera', 'Artesanías del Valle'];
  }, []);

  const activeCategoryName = useMemo(() => {
    if (!filters.categoria) return null;
    const match = categories.find(c => c.id === filters.categoria || c.slug === filters.categoria);
    return match ? match.nombre : filters.categoria;
  }, [filters.categoria, categories]);

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-main)', minHeight: '90vh', padding: '36px 0 80px' }}>
      <div className="cv-container">
        
        {/* Header and Title */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
            Tienda CasaViva
          </span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--cv-text-main)', marginTop: '4px' }}>
            {activeCategoryName ? activeCategoryName : filters.disponibilidad === 'bajo_100' ? 'Novedades bajo S/ 100' : filters.disponibilidad === 'ofertas' ? 'Ofertas Especiales' : 'Catálogo Completo'}
          </h1>
          <p style={{ color: 'var(--cv-text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>
            Mostrando {total} {total === 1 ? 'producto seleccionado' : 'productos seleccionados'} para armonizar tu hogar.
          </p>
        </div>

        {/* Toolbar: Active Filter Chips, Mobile Filter Toggle & Sort Selector */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--cv-radius-lg)',
            border: '1px solid var(--cv-border)',
            marginBottom: '32px',
          }}
        >
          {/* Active filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {filters.busqueda && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', backgroundColor: 'var(--cv-bg-warm)', padding: '4px 10px', borderRadius: 'var(--cv-radius-full)', border: '1px solid var(--cv-border)' }}>
                Búsqueda: "{filters.busqueda}"
                <button onClick={() => handleFilterChange({ busqueda: undefined, pagina: 1 })} style={{ display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {activeCategoryName && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', backgroundColor: 'var(--cv-primary-light)', color: 'var(--cv-primary)', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--cv-radius-full)' }}>
                {activeCategoryName}
                <button onClick={() => handleFilterChange({ categoria: undefined, pagina: 1 })} style={{ display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.marca && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', backgroundColor: 'var(--cv-bg-warm)', padding: '4px 10px', borderRadius: 'var(--cv-radius-full)', border: '1px solid var(--cv-border)' }}>
                Marca: {filters.marca}
                <button onClick={() => handleFilterChange({ marca: undefined, pagina: 1 })} style={{ display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.disponibilidad && filters.disponibilidad !== 'todos' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', backgroundColor: 'var(--cv-accent-light)', color: 'var(--cv-accent)', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--cv-radius-full)' }}>
                {filters.disponibilidad === 'bajo_100' ? 'Bajo S/ 100' : filters.disponibilidad === 'ofertas' ? 'Ofertas' : 'En stock'}
                <button onClick={() => handleFilterChange({ disponibilidad: 'todos', pagina: 1 })} style={{ display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{ display: 'none', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--cv-primary)' }}
              className="mobile-filter-trigger"
            >
              <SlidersHorizontal size={16} /> Filtros
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={16} color="var(--cv-text-muted)" />
              <label htmlFor="sort-select" style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>
                Ordenar:
              </label>
              <select
                id="sort-select"
                value={filters.orden || 'relevancia'}
                onChange={e => handleFilterChange({ orden: e.target.value as any, pagina: 1 })}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--cv-radius-md)',
                  border: '1px solid var(--cv-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.875rem',
                  color: 'var(--cv-text-main)',
                  outline: 'none',
                }}
              >
                <option value="relevancia">Relevancia CasaViva</option>
                <option value="menor_precio">Precio: Menor a Mayor</option>
                <option value="mayor_precio">Precio: Mayor a Menor</option>
                <option value="nuevos">Más Nuevos</option>
                <option value="calificacion">Mejor Calificados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '36px', alignItems: 'start' }} className="catalog-grid">
          
          {/* Sidebar Filters */}
          <aside className={`catalog-sidebar ${showMobileFilters ? 'mobile-visible' : ''}`}>
            <ProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              brands={brands}
            />
          </aside>

          {/* Product Grid & Pagination */}
          <main>
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onNavigate={onNavigate}
              currentPage={filters.pagina || 1}
              totalPages={totalPages}
              onPageChange={page => handleFilterChange({ pagina: page })}
              onResetFilters={handleResetFilters}
            />
          </main>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .catalog-grid { grid-template-columns: 1fr !important; }
          .catalog-sidebar { display: none; }
          .catalog-sidebar.mobile-visible {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 1000;
            background: #FFFFFF;
            padding: 24px;
            overflow-y: auto;
          }
          .mobile-filter-trigger { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
