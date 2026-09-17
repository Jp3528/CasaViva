import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, param?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variantes && product.variantes.length > 0 ? product.variantes[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.estado === 'Agotado' || (selectedVariant && selectedVariant.stock === 0);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    showToast(
      added ? `"${product.nombre}" guardado en tus favoritos` : `"${product.nombre}" eliminado de favoritos`,
      'info'
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast('Este producto se encuentra temporalmente agotado', 'advertencia');
      return;
    }
    addToCart(product, selectedVariant, 1);
    showToast(`"${product.nombre}" agregado al carrito`, 'exito');
  };

  const currentPrice = product.precio_base + (selectedVariant?.precio_adicional || 0);

  return (
    <div
      className="cv-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => onNavigate('producto', product.slug || product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', backgroundColor: 'var(--cv-bg-warm)', overflow: 'hidden' }}>
        <img
          src={selectedVariant?.imagen_variante || product.imagen_principal}
          alt={product.nombre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Badges Top-Left */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 5 }}>
          {product.estado && <Badge state={product.estado} />}
          {product.descuento_porcentaje && product.descuento_porcentaje > 0 ? (
            <span style={{ backgroundColor: 'var(--cv-accent)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              -{product.descuento_porcentaje}%
            </span>
          ) : null}
        </div>

        {/* Favorite Heart Button Top-Right */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorited ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
            boxShadow: 'var(--cv-shadow-sm)',
            zIndex: 5,
            transition: 'transform 0.2s ease',
          }}
          aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart size={18} fill={isFavorited ? 'var(--cv-accent)' : 'none'} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
            zIndex: 5,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn-primary"
            style={{ flex: 1, padding: '9px 12px', fontSize: '0.8125rem' }}
          >
            <ShoppingBag size={15} />
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-light)', fontWeight: 600 }}>
            {product.categoria_nombre}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>
            {product.marca}
          </span>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cv-text-main)', marginBottom: '8px', lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.nombre}
        </h3>

        {/* Reviews */}
        <div style={{ marginBottom: '10px' }}>
          <RatingStars rating={product.calificacion_promedio} showText totalReviews={product.total_resenas} size={14} />
        </div>

        {/* Color Swatches */}
        {product.variantes && product.variantes.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            {product.variantes.slice(0, 4).map(v => (
              <span
                key={v.id}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedVariant(v);
                }}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: v.color_hex,
                  border: selectedVariant?.id === v.id ? '2px solid var(--cv-primary)' : '1px solid #D5CFC2',
                  cursor: 'pointer',
                }}
                title={v.color_nombre}
              />
            ))}
            {product.variantes.length > 4 && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--cv-text-muted)' }}>
                +{product.variantes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price Row */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '1.1875rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
            S/ {currentPrice.toFixed(2)}
          </span>
          {product.precio_anterior && (
            <span style={{ fontSize: '0.875rem', color: 'var(--cv-text-light)', textDecoration: 'line-through' }}>
              S/ {product.precio_anterior.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
