import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { Button } from '../ui/Button';

interface CartDrawerProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
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
    isDrawerOpen,
    setIsDrawerOpen,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { showToast } = useToast();

  if (!isDrawerOpen) return null;

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

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    onNavigate('checkout');
  };

  const handleViewCartPage = () => {
    setIsDrawerOpen(false);
    onNavigate('carrito');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / 199.00) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(32, 32, 30, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--cv-shadow-lg)',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--cv-border-subtle)',
            backgroundColor: 'var(--cv-bg-warm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--cv-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
              Tu Carrito de Compra
            </h3>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{ padding: '6px', color: 'var(--cv-text-muted)', display: 'flex', alignItems: 'center' }}
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ padding: '12px 24px', backgroundColor: 'var(--cv-bg-main)', borderBottom: '1px solid var(--cv-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--cv-text-main)', marginBottom: '6px' }}>
            <Truck size={15} color="var(--cv-primary)" />
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Agrega <strong>S/ {amountNeededForFreeShipping.toFixed(2)}</strong> más para <strong>Envío Gratis</strong>
              </span>
            ) : (
              <span style={{ color: 'var(--cv-primary)', fontWeight: 600 }}>
                🎉 ¡Felicidades! Tienes Envío Gratis garantizado
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--cv-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--cv-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--cv-text-muted)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cv-bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--cv-text-light)' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '1.125rem', color: 'var(--cv-text-main)', marginBottom: '6px' }}>
                Tu carrito está vacío
              </h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                Descubre piezas para transformar tu hogar con diseño y calidez.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsDrawerOpen(false);
                  onNavigate('catalogo');
                }}
              >
                Explorar Catálogo
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map(item => (
                <div
                  key={item.variante_id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--cv-border-subtle)',
                  }}
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre_producto}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', backgroundColor: 'var(--cv-bg-warm)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4
                        onClick={() => {
                          setIsDrawerOpen(false);
                          onNavigate('producto', item.producto_id);
                        }}
                        style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cv-text-main)', lineHeight: 1.3, cursor: 'pointer' }}
                      >
                        {item.nombre_producto}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.variante_id)}
                        style={{ color: 'var(--cv-text-light)', padding: '2px', background: 'none' }}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)', marginTop: '2px', marginBottom: '8px' }}>
                      Color: {item.color_nombre}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--cv-border)', borderRadius: '4px' }}>
                        <button
                          onClick={() => updateQuantity(item.variante_id, item.cantidad - 1)}
                          style={{ padding: '4px 8px', color: 'var(--cv-text-main)', display: 'flex', alignItems: 'center' }}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variante_id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.stock_disponible}
                          style={{ padding: '4px 8px', color: 'var(--cv-text-main)', display: 'flex', alignItems: 'center', opacity: item.cantidad >= item.stock_disponible ? 0.4 : 1 }}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--cv-primary)' }}>
                        S/ {item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--cv-border)',
              backgroundColor: 'var(--cv-bg-warm)',
            }}
          >
            {/* Coupon Section */}
            <div style={{ marginBottom: '16px' }}>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--cv-primary-light)', borderRadius: '6px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cv-primary)', fontWeight: 600 }}>
                    <Tag size={14} /> Cupón <strong>{appliedCoupon.codigo}</strong> (-S/ {discount.toFixed(2)})
                  </div>
                  <button onClick={removeCoupon} style={{ color: 'var(--cv-accent)', fontSize: '0.75rem', fontWeight: 600 }}>
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Código de cupón (Ej: CASAVIVA10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--cv-border)', fontSize: '0.8125rem', backgroundColor: '#FFFFFF' }}
                  />
                  <Button type="submit" variant="secondary" size="sm" isLoading={isApplyingCoupon}>
                    Aplicar
                  </Button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', marginBottom: '16px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700, color: 'var(--cv-text-main)', borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Estimado</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="primary" size="lg" onClick={handleCheckoutClick} style={{ width: '100%' }}>
                Iniciar Checkout Seguro <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewCartPage} style={{ width: '100%' }}>
                Ver y Modificar Carrito Completo
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
