import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
  onNavigate: (page: string, param?: string) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  categoryId,
  onNavigate,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const res = await productService.getRelatedProducts(productId, categoryId);
        setProducts(res.productos || []);
      } catch (err) {
        console.error('Error cargando relacionados:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRelated();
  }, [productId, categoryId]);

  if (isLoading || products.length === 0) return null;

  return (
    <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--cv-border-subtle)' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
          Completa tu ambiente
        </span>
        <h3 style={{ fontSize: '1.75rem', color: 'var(--cv-text-main)', marginTop: '4px' }}>
          Productos relacionados
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};
