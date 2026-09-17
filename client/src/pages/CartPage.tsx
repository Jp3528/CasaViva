import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shipping,
    total,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [departamento, setDepartamento] = useState('Lima');
  const { showToast } = useToast();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    const res = await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);

    if (res.success) {
      showToast(res.message, 'exito');
      setCouponInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cv-bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--cv-text-light)' }}>
          <ShoppingBag size={28} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
          Explora nuestro catálogo para encontrar piezas de diseño que transformen tu hogar.
        </p>
        <Button variant="primary" size="lg" onClick={() => onNavigate('catalogo')}>
          Explorar Catálogo
        </Button>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((subtotal / 199.00) * 100));

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '90vh', padding: '48px 0 80px' }}>
      <div className="cv-container">
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px', color: 'var(--cv-text-main)' }}>
          Bolsa de Compras ({items.length} {items.length === 1 ? 'artículo' : 'artículos'})
        </h1>

        {/* Free Shipping Alert Bar */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: 'var(--cv-radius-md)', border: '1px solid var(--cv-border)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', marginBottom: '8px' }}>
            <Truck size={18} color="var(--cv-primary)" />
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Te falta solo <strong>S/ {amountNeededForFreeShipping.toFixed(2)}</strong> para obtener <strong>Envío Gratis</strong> a todo el Perú.
              </span>
            ) : (
              <span style={{ color: 'var(--cv-primary)', fontWeight: 600 }}>
                🎉 ¡Felicidades! Calificas para <strong>Envío Gratuito</strong> a nivel nacional.
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--cv-bg-warm)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--cv-primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }} className="cart-grid">
          
          {/* Items Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--cv-border-subtle)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-muted)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '16px' }} className="cart-header-row">
              <span>Producto</span>
              <span style={{ textAlign: 'center' }}>Cantidad</span>
              <span style={{ textAlign: 'right' }}>Total</span>
              <span></span>
            </div>

            <div style={{ padding: '12px 24px' }}>
              {items.map(item => (
                <div
                  key={item.variante_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 40px',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--cv-border-subtle)',
                  }}
                  className="cart-item-row"
                >
                  {/* Product Details */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img
                      src={item.imagen}
                      alt={item.nombre_producto}
                      style={{ width: '74px', height: '74px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <h4
                        onClick={() => onNavigate('producto', item.producto_id)}
                        style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cv-text-main)', cursor: 'pointer', lineHeight: 1.3, marginBottom: '4px' }}
                      >
                        {item.nombre_producto}
                      </h4>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>
                        Variante: {item.color_nombre}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--cv-text-light)' }}>
                        P. Unitario: S/ {item.precio_unitario.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--cv-border)', borderRadius: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.variante_id, item.cantidad - 1)}
                        style={{ padding: '6px 10px', color: 'var(--cv-text-main)' }}
                        aria-label="Disminuir"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: '28px', textAlign: 'center' }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variante_id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock_disponible}
                        style={{ padding: '6px 10px', color: 'var(--cv-text-main)', opacity: item.cantidad >= item.stock_disponible ? 0.4 : 1 }}
                        aria-label="Aumentar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: 'right', fontSize: '1rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                    S/ {item.subtotal.toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => removeFromCart(item.variante_id)}
                      style={{ color: 'var(--cv-text-light)', padding: '6px', background: 'none' }}
                      aria-label="Eliminar item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Summary Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '12px' }}>
              Resumen de Compra
            </h3>

            {/* Coupon Box */}
            <div style={{ marginBottom: '20px' }}>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--cv-primary-light)', borderRadius: '6px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cv-primary)', fontWeight: 600 }}>
                    <Tag size={14} /> Cupón {appliedCoupon.codigo}
                  </div>
                  <button onClick={removeCoupon} style={{ color: 'var(--cv-accent)', fontWeight: 600, fontSize: '0.75rem' }}>
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Código de cupón"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    style={{ padding: '8px 12px', fontSize: '0.8125rem' }}
                  />
                  <Button type="submit" variant="secondary" size="sm" isLoading={isApplyingCoupon}>
                    Aplicar
                  </Button>
                </form>
              )}
            </div>

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-accent)' }}>
                  <span>Descuento aplicado</span>
                  <span>-S/ {discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                <span>Envío estimado</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--cv-primary)' }}>GRATIS</strong> : `S/ ${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cv-text-main)', borderTop: '1px solid var(--cv-border)', paddingTop: '12px' }}>
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('checkout')}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              Proceder al Checkout <ArrowRight size={18} />
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
              <ShieldCheck size={14} color="var(--cv-primary)" />
              Compra protegida con garantía de devolución
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-header-row { display: none !important; }
          .cart-item-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
};
