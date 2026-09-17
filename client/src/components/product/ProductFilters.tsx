import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { Category } from '../../types';
import { ProductFiltersQuery } from '../../services/productService';

interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFiltersQuery;
  onFilterChange: (newFilters: Partial<ProductFiltersQuery>) => void;
  onResetFilters: () => void;
  brands: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  brands,
}) => {
  const priceRanges = [
    { label: 'Todos los precios', min: undefined, max: undefined },
    { label: 'Bajo S/ 100 (Económico)', min: 0, max: 100 },
    { label: 'S/ 100 a S/ 300', min: 100, max: 300 },
    { label: 'S/ 300 a S/ 700', min: 300, max: 700 },
    { label: 'Más de S/ 700', min: 700, max: 5000 },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--cv-radius-lg)',
        border: '1px solid var(--cv-border)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1rem', color: 'var(--cv-text-main)' }}>
          <Filter size={18} color="var(--cv-primary)" /> Filtros
        </div>
        <button
          onClick={onResetFilters}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--cv-text-muted)', cursor: 'pointer' }}
          title="Limpiar todos los filtros"
        >
          <RotateCcw size={13} /> Limpiar
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-main)', marginBottom: '12px' }}>
          Categorías
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => onFilterChange({ categoria: undefined, pagina: 1 })}
            style={{
              textAlign: 'left',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: !filters.categoria ? 600 : 400,
              backgroundColor: !filters.categoria ? 'var(--cv-primary-light)' : 'transparent',
              color: !filters.categoria ? 'var(--cv-primary)' : 'var(--cv-text-main)',
            }}
          >
            Todas las categorías
          </button>
          {categories.map(cat => {
            const isSelected = filters.categoria === cat.id || filters.categoria === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ categoria: cat.id, pagina: 1 })}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 600 : 400,
                  backgroundColor: isSelected ? 'var(--cv-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{cat.nombre}</span>
                {isSelected && <Check size={14} color="var(--cv-primary)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-main)', marginBottom: '12px' }}>
          Rango de Precio
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {priceRanges.map((range, idx) => {
            const isSelected = filters.precioMin === range.min && filters.precioMax === range.max;
            return (
              <button
                key={idx}
                onClick={() => onFilterChange({ precioMin: range.min, precioMax: range.max, pagina: 1 })}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 600 : 400,
                  backgroundColor: isSelected ? 'var(--cv-bg-warm)' : 'transparent',
                  color: isSelected ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                }}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability / Tag Filter */}
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-main)', marginBottom: '12px' }}>
          Disponibilidad y Ofertas
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="disponibilidad"
              checked={!filters.disponibilidad || filters.disponibilidad === 'todos'}
              onChange={() => onFilterChange({ disponibilidad: 'todos', pagina: 1 })}
            />
            Todos los productos
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="disponibilidad"
              checked={filters.disponibilidad === 'en_stock'}
              onChange={() => onFilterChange({ disponibilidad: 'en_stock', pagina: 1 })}
            />
            Solo con stock disponible
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="disponibilidad"
              checked={filters.disponibilidad === 'ofertas'}
              onChange={() => onFilterChange({ disponibilidad: 'ofertas', pagina: 1 })}
            />
            Solo productos en oferta
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="disponibilidad"
              checked={filters.disponibilidad === 'bajo_100'}
              onChange={() => onFilterChange({ disponibilidad: 'bajo_100', pagina: 1 })}
            />
            Novedades bajo S/ 100
          </label>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-main)', marginBottom: '12px' }}>
            Marca
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => onFilterChange({ marca: undefined, pagina: 1 })}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: !filters.marca ? 600 : 400,
                color: !filters.marca ? 'var(--cv-primary)' : 'var(--cv-text-main)',
              }}
            >
              Todas las marcas
            </button>
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => onFilterChange({ marca: brand, pagina: 1 })}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: filters.marca === brand ? 600 : 400,
                  backgroundColor: filters.marca === brand ? 'var(--cv-bg-warm)' : 'transparent',
                  color: filters.marca === brand ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
