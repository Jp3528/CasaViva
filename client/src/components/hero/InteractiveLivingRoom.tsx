import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { productService } from '../../services/productService';
import { Product, ProductVariant } from '../../types';

interface HotspotItem {
  id: string;
  productId: string;
  label: string;
  top: string;
  left: string;
  cardPlacement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface InteractiveLivingRoomProps {
  onNavigate: (page: string, param?: string) => void;
}

export const InteractiveLivingRoom: React.FC<InteractiveLivingRoomProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});

  const hotspots: HotspotItem[] = [
    {
      id: 'hs-sofa',
      productId: 'prod-sofa-modular-toscana',
      label: 'Sofá Modular',
      top: '62%',
      left: '46%',
      cardPlacement: 'top-right',
    },
    {
      id: 'hs-lampara',
      productId: 'prod-lampara-pie-nordica',
      label: 'Lámpara de Pie',
      top: '38%',
      left: '20%',
      cardPlacement: 'bottom-right',
    },
    {
      id: 'hs-mesa',
      productId: 'prod-mesa-centro-nordica',
      label: 'Mesa de Centro',
      top: '76%',
      left: '32%',
      cardPlacement: 'top-left',
    },
    {
      id: 'hs-cojines',
      productId: 'prod-cojin-lino-lavado',
      label: 'Cojín de Lino',
      top: '55%',
      left: '68%',
      cardPlacement: 'top-left',
    },
    {
      id: 'hs-alfombra',
      productId: 'prod-alfombra-yute-organica',
      label: 'Alfombra de Yute',
      top: '84%',
      left: '55%',
      cardPlacement: 'top-left',
    },
  ];

  useEffect(() => {
    const fetchHotspotProducts = async () => {
      try {
        const pMap: Record<string, Product> = {};
        const vMap: Record<string, ProductVariant> = {};

        for (const hs of hotspots) {
          const res = await productService.getProductBySlugOrId(hs.productId);
          if (res.producto) {
            pMap[hs.productId] = res.producto;
            if (res.producto.variantes && res.producto.variantes.length > 0) {
              vMap[hs.productId] = res.producto.variantes[0];
            }
          }
        }
        setProductsMap(pMap);
        setSelectedVariants(vMap);
      } catch (err) {
        console.error('Error cargando productos de sala interactiva:', err);
      }
    };

    fetchHotspotProducts();
  }, []);

  const handleVariantChange = (productId: string, variant: ProductVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = selectedVariants[product.id] || (product.variantes && product.variantes[0]);
    addToCart(product, variant, 1);
    showToast(`"${product.nombre}" (${variant?.color_nombre || 'Estándar'}) agregado al carrito`, 'exito');
  };

  return (
    <section style={{ position: 'relative', width: '100%', backgroundColor: 'var(--cv-bg-warm)', paddingBottom: '32px' }}>
      {/* Intro Editorial Header */}
      <div className="cv-container" style={{ paddingTop: '40px', paddingBottom: '24px', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600, marginBottom: '8px' }}>
          <Sparkles size={16} /> Experiencia Interactiva CasaViva
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--cv-text-main)', marginBottom: '12px' }}>
          Espacios creados para la calma
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1rem', color: 'var(--cv-text-muted)' }}>
          Explora nuestra sala contemporánea interactiva. Pasa el cursor o toca los puntos para descubrir piezas, acabados y agregarlos a tu hogar.
        </p>
      </div>

      {/* Main Living Room Canvas */}
      <div className="cv-container">
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            minHeight: '440px',
            borderRadius: 'var(--cv-radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--cv-shadow-lg)',
            border: '1px solid var(--cv-border)',
          }}
          onClick={() => setActiveHotspotId(null)}
        >
          {/* Main Realistic Room Image */}
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85"
            alt="Sala contemporánea realista CasaViva"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Subtle Ambient Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 40%, rgba(32, 32, 30, 0.25) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Interactive Hotspots */}
          {hotspots.map(hs => {
            const product = productsMap[hs.productId];
            const isActive = activeHotspotId === hs.id;
            const currentVariant = selectedVariants[hs.productId];

            return (
              <div
                key={hs.id}
                style={{
                  position: 'absolute',
                  top: hs.top,
                  left: hs.left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 50 : 20,
                }}
                onMouseEnter={() => setActiveHotspotId(hs.id)}
                onMouseLeave={() => {
                  // Keep open on touch, close on desktop leave
                  if (window.innerWidth > 768) {
                    setActiveHotspotId(null);
                  }
                }}
                onClick={e => {
                  e.stopPropagation();
                  setActiveHotspotId(isActive ? null : hs.id);
                }}
              >
                {/* Hotspot Disc */}
                <div
                  className={`hotspot-point ${isActive ? 'active' : ''}`}
                  title={hs.label}
                  aria-label={hs.label}
                />

                {/* Floating Card */}
                {isActive && product && (
                  <div
                    className="hotspot-card"
                    style={{
                      top: hs.cardPlacement.includes('top') ? 'auto' : '36px',
                      bottom: hs.cardPlacement.includes('top') ? '36px' : 'auto',
                      left: hs.cardPlacement.includes('left') ? 'auto' : '0',
                      right: hs.cardPlacement.includes('left') ? '0' : 'auto',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                      <img
                        src={currentVariant?.imagen_variante || product.imagen_principal}
                        alt={product.nombre}
                        style={{
                          width: '74px',
                          height: '74px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--cv-border-subtle)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-primary)', fontWeight: 600 }}>
                          {product.categoria_nombre}
                        </span>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cv-text-main)', lineHeight: 1.3, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.nombre}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cv-primary)' }}>
                            S/ {(product.precio_base + (currentVariant?.precio_adicional || 0)).toFixed(2)}
                          </span>
                          {product.precio_anterior && (
                            <span style={{ fontSize: '0.8125rem', color: 'var(--cv-text-light)', textDecoration: 'line-through' }}>
                              S/ {product.precio_anterior.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                      {product.descripcion_corta}
                    </p>

                    {/* Color Swatches Switcher */}
                    {product.variantes && product.variantes.length > 1 && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--cv-text-muted)', marginBottom: '4px' }}>
                          Color: <strong>{currentVariant?.color_nombre}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {product.variantes.map(v => (
                            <button
                              key={v.id}
                              onClick={e => handleVariantChange(product.id, v, e)}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: v.color_hex,
                                border: currentVariant?.id === v.id ? '2px solid var(--cv-primary)' : '1px solid #D5CFC2',
                                outline: currentVariant?.id === v.id ? '2px solid rgba(83, 99, 75, 0.3)' : 'none',
                                outlineOffset: '1px',
                                cursor: 'pointer',
                              }}
                              title={v.color_nombre}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '4px', borderTop: '1px solid var(--cv-border-subtle)' }}>
                      <button
                        onClick={e => handleQuickAdd(product, e)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.8125rem' }}
                      >
                        <ShoppingBag size={14} /> Comprar
                      </button>
                      <button
                        onClick={() => onNavigate('producto', product.slug || product.id)}
                        className="btn-secondary"
                        style={{ padding: '8px 10px', fontSize: '0.8125rem' }}
                        title="Ver ficha completa"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Bar */}
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--cv-radius-lg)',
            padding: '16px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            border: '1px solid var(--cv-border)',
            boxShadow: 'var(--cv-shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
              ¿Buscas rediseñar tu sala u otro ambiente?
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--cv-text-main)' }}>
              Mobiliario modular y textiles en lino europeo
            </span>
          </div>
          <button
            onClick={() => onNavigate('catalogo')}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.875rem' }}
          >
            Ver Catálogo Completo <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
