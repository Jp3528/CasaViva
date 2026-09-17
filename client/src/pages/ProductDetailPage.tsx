import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewSection } from '../components/product/ReviewSection';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RatingStars } from '../components/ui/RatingStars';
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Plus, Minus, ChevronRight, Share2 } from 'lucide-react';

interface ProductDetailPageProps {
  idOrSlug: string;
  onNavigate: (page: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ idOrSlug, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'dimensiones' | 'cuidados'>('descripcion');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProductBySlugOrId(idOrSlug);
        setProduct(res.producto);
        if (res.producto?.variantes && res.producto.variantes.length > 0) {
          setSelectedVariant(res.producto.variantes[0]);
        }
      } catch (err) {
        console.error('Error cargando detalle del producto:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (idOrSlug) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [idOrSlug]);

  if (isLoading) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ fontSize: '1.125rem', color: 'var(--cv-text-muted)' }}>Cargando detalles de la pieza...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Producto no encontrado</h2>
        <p style={{ color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
          La pieza que estás buscando ya no está disponible en nuestro catálogo.
        </p>
        <Button variant="primary" onClick={() => onNavigate('catalogo')}>
          Volver al Catálogo
        </Button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentPrice = product.precio_base + (selectedVariant?.precio_adicional || 0);
  const isOutOfStock = product.estado === 'Agotado' || (selectedVariant && selectedVariant.stock === 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    showToast(`¡${quantity}x "${product.nombre}" (${selectedVariant?.color_nombre}) agregado al carrito!`, 'exito');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    onNavigate('checkout');
  };

  const handleFavoriteClick = () => {
    const added = toggleWishlist(product.id);
    showToast(
      added ? `"${product.nombre}" añadido a tus favoritos` : `"${product.nombre}" removido de favoritos`,
      'info'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.nombre} | CasaViva`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace del producto copiado al portapapeles', 'info');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-main)', minHeight: '90vh', padding: '24px 0 80px' }}>
      <div className="cv-container">
        
        {/* Breadcrumb Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--cv-text-muted)', marginBottom: '28px' }}>
          <button onClick={() => onNavigate('home')} style={{ color: 'var(--cv-text-muted)' }}>Inicio</button>
          <ChevronRight size={14} />
          <button onClick={() => onNavigate('catalogo')} style={{ color: 'var(--cv-text-muted)' }}>Catálogo</button>
          <ChevronRight size={14} />
          <button onClick={() => onNavigate('catalogo', `categoria=${product.categoria_id}`)} style={{ color: 'var(--cv-text-muted)' }}>{product.categoria_nombre}</button>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--cv-text-main)', fontWeight: 600 }}>{product.nombre}</span>
        </nav>

        {/* Top Product Details Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start' }}>
          
          {/* Left Column: Image Gallery */}
          <ImageGallery images={product.galeria_imagenes} productName={product.nombre} />

          {/* Right Column: Information & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header / Brand / Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cv-primary)', fontWeight: 600 }}>
                  {product.categoria_nombre} · {product.marca}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.estado && <Badge state={product.estado} />}
                  <button onClick={handleShare} style={{ color: 'var(--cv-text-muted)', padding: '4px' }} title="Compartir">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <h1 style={{ fontSize: '2rem', color: 'var(--cv-text-main)', lineHeight: 1.25, marginBottom: '12px' }}>
                {product.nombre}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RatingStars rating={product.calificacion_promedio} showText totalReviews={product.total_resenas} size={18} />
              </div>
            </div>

            {/* Price Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '16px 20px', backgroundColor: 'var(--cv-bg-warm)', borderRadius: 'var(--cv-radius-md)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                S/ {currentPrice.toFixed(2)}
              </span>
              {product.precio_anterior && (
                <span style={{ fontSize: '1.125rem', color: 'var(--cv-text-light)', textDecoration: 'line-through' }}>
                  S/ {product.precio_anterior.toFixed(2)}
                </span>
              )}
              {product.descuento_porcentaje && product.descuento_porcentaje > 0 ? (
                <span style={{ fontSize: '0.8125rem', backgroundColor: 'var(--cv-accent)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Ahorras {product.descuento_porcentaje}%
                </span>
              ) : null}
            </div>

            <p style={{ fontSize: '0.9375rem', color: 'var(--cv-text-muted)', lineHeight: 1.6 }}>
              {product.descripcion_corta}
            </p>

            {/* Variant Selector */}
            <VariantSelector
              variants={product.variantes}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />

            {/* Quantity and Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--cv-border)', borderRadius: 'var(--cv-radius-md)', height: '48px', backgroundColor: '#FFFFFF' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0 14px', height: '100%', color: 'var(--cv-text-main)' }}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 600, fontSize: '0.9375rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={selectedVariant ? quantity >= selectedVariant.stock : false}
                    style={{ padding: '0 14px', height: '100%', color: 'var(--cv-text-main)', opacity: selectedVariant && quantity >= selectedVariant.stock ? 0.4 : 1 }}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ShoppingBag size={20} />}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  style={{ flex: 1, height: '48px' }}
                >
                  {isOutOfStock ? 'Producto Agotado' : 'Agregar a la Bolsa'}
                </Button>

                {/* Wishlist Button */}
                <button
                  onClick={handleFavoriteClick}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--cv-radius-md)',
                    border: '1px solid var(--cv-border)',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isFavorited ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
                  }}
                  aria-label="Guardar en favoritos"
                >
                  <Heart size={22} fill={isFavorited ? 'var(--cv-accent)' : 'none'} />
                </button>
              </div>

              {/* Buy Now Button */}
              {!isOutOfStock && (
                <Button variant="accent" size="lg" onClick={handleBuyNow} style={{ width: '100%' }}>
                  Comprar Ahora
                </Button>
              )}
            </div>

            {/* Value Props & Assurances */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '20px', fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="var(--cv-primary)" />
                <span>Envío gratis desde S/ 199</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="var(--cv-primary)" />
                <span>30 días para cambios</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--cv-primary)" />
                <span>Garantía de calidad de origen</span>
              </div>
            </div>

          </div>

        </div>

        {/* Technical Specs & Details Tabs */}
        <div style={{ marginTop: '64px', backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', overflow: 'hidden' }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--cv-border)', backgroundColor: 'var(--cv-bg-warm)' }}>
            <button
              onClick={() => setActiveTab('descripcion')}
              style={{
                padding: '16px 24px',
                fontWeight: activeTab === 'descripcion' ? 600 : 500,
                fontSize: '0.9375rem',
                color: activeTab === 'descripcion' ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                borderBottom: activeTab === 'descripcion' ? '2px solid var(--cv-primary)' : '2px solid transparent',
                backgroundColor: activeTab === 'descripcion' ? '#FFFFFF' : 'transparent',
              }}
            >
              Descripción y Características
            </button>
            <button
              onClick={() => setActiveTab('dimensiones')}
              style={{
                padding: '16px 24px',
                fontWeight: activeTab === 'dimensiones' ? 600 : 500,
                fontSize: '0.9375rem',
                color: activeTab === 'dimensiones' ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                borderBottom: activeTab === 'dimensiones' ? '2px solid var(--cv-primary)' : '2px solid transparent',
                backgroundColor: activeTab === 'dimensiones' ? '#FFFFFF' : 'transparent',
              }}
            >
              Dimensiones y Medidas
            </button>
            <button
              onClick={() => setActiveTab('cuidados')}
              style={{
                padding: '16px 24px',
                fontWeight: activeTab === 'cuidados' ? 600 : 500,
                fontSize: '0.9375rem',
                color: activeTab === 'cuidados' ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                borderBottom: activeTab === 'cuidados' ? '2px solid var(--cv-primary)' : '2px solid transparent',
                backgroundColor: activeTab === 'cuidados' ? '#FFFFFF' : 'transparent',
              }}
            >
              Materiales y Cuidados
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'descripcion' && (
              <div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--cv-text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {product.descripcion}
                </p>
                {product.caracteristicas && product.caracteristicas.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cv-text-main)', marginBottom: '12px' }}>
                      Detalles destacados:
                    </h4>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
                      {product.caracteristicas.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dimensiones' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cv-text-main)', marginBottom: '10px' }}>
                  Medidas exactas del producto:
                </h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--cv-text-muted)', marginBottom: '16px' }}>
                  {product.dimensiones}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--cv-text-light)' }}>
                  * Te recomendamos medir tus accesos (puertas y pasillos) antes de ordenar piezas de gran formato.
                </p>
              </div>
            )}

            {activeTab === 'cuidados' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cv-text-main)', marginBottom: '10px' }}>
                  Mantenimiento y preservación:
                </h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--cv-text-muted)', lineHeight: 1.6 }}>
                  {product.cuidados}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ReviewSection
          productId={product.id}
          averageRating={product.calificacion_promedio}
          totalReviews={product.total_resenas}
        />

        {/* Related Products Carousel */}
        <RelatedProducts
          productId={product.id}
          categoryId={product.categoria_id}
          onNavigate={onNavigate}
        />

      </div>
    </div>
  );
};
