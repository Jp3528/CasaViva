import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onNavigate: (page: string, param?: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onNavigate,
  currentPage,
  totalPages,
  onPageChange,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No encontramos productos con estos filtros"
        description="Prueba seleccionando otra categoría o ampliando el rango de precio para encontrar lo que buscas."
        icon={<SearchX size={32} />}
        actionText="Restablecer todos los filtros"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {products.map(product => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--cv-radius-md)',
              border: '1px solid var(--cv-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--cv-text-main)',
              display: 'flex',
              alignItems: 'center',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
            }}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--cv-radius-md)',
                  border: isCurrent ? '1px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                  backgroundColor: isCurrent ? 'var(--cv-primary)' : '#FFFFFF',
                  color: isCurrent ? '#FFFFFF' : 'var(--cv-text-main)',
                  fontWeight: isCurrent ? 600 : 400,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--cv-radius-md)',
              border: '1px solid var(--cv-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--cv-text-main)',
              display: 'flex',
              alignItems: 'center',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages ? 0.5 : 1,
            }}
            aria-label="Página siguiente"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
