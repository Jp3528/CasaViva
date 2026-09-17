import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { PaymentMethod, InvoiceType, CustomerData, ShippingAddress, BillingData } from '../types';
import { Button } from '../components/ui/Button';
import { ShieldCheck, CreditCard, QrCode, Lock, CheckCircle2, ArrowLeft, Truck, Receipt } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Data
  const [customer, setCustomer] = useState<CustomerData>({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    tipo_documento: 'DNI',
    numero_documento: '',
  });

  // Shipping Address
  const [address, setAddress] = useState<ShippingAddress>({
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'Miraflores',
    direccion: '',
    referencia: '',
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'estandar' | 'express'>('estandar');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');

  // Card details (demo)
  const [cardData, setCardData] = useState({
    numero: '',
    titular: '',
    expiracion: '',
    cvv: '',
  });

  // Yape details
  const [yapeCode, setYapeCode] = useState('');

  // Invoice / Facturación
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('boleta');
  const [billing, setBilling] = useState<BillingData>({
    tipo_comprobante: 'boleta',
    ruc: '',
    razon_social: '',
    direccion_fiscal: '',
  });

  if (items.length === 0) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Tu carrito de compra está vacío</h2>
        <p style={{ color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
          Agrega productos a tu carrito antes de proceder al checkout.
        </p>
        <Button variant="primary" size="lg" onClick={() => onNavigate('catalogo')}>
          Ir al Catálogo
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customer.nombre.trim() || !customer.email.trim() || !customer.numero_documento.trim()) {
      showToast('Por favor completa todos tus datos personales y documento', 'error');
      return;
    }

    if (!address.direccion.trim() || !address.distrito.trim()) {
      showToast('Por favor completa tu dirección de entrega', 'error');
      return;
    }

    if (invoiceType === 'factura' && (!billing.ruc || billing.ruc.length !== 11)) {
      showToast('Para emitir Factura ingresa un RUC válido de 11 dígitos', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        usuario_id: user?.id,
        items: items.map(i => ({
          producto_id: i.producto_id,
          variante_id: i.variante_id,
          cantidad: i.cantidad,
        })),
        datos_cliente: customer,
        direccion_envio: address,
        metodo_envio: shippingMethod === 'express' ? 'Envío Express 24h' : (shipping === 0 ? 'Envío Gratuito Estándar' : 'Envío Estándar'),
        metodo_pago: paymentMethod,
        codigo_cupon: appliedCoupon?.codigo,
        tipo_comprobante: invoiceType,
        datos_facturacion: invoiceType === 'factura' ? { ...billing, tipo_comprobante: 'factura' as InvoiceType } : undefined,
      };

      const res = await orderService.createOrder(orderPayload);
      clearCart();
      showToast('¡Pedido procesado con éxito!', 'exito', 'Compra confirmada');
      onNavigate('pedido-confirmado', res.pedido.codigo_orden);
    } catch (err: any) {
      showToast(err.message || 'Error al procesar el pedido', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalShippingCost = shippingMethod === 'express' ? 25.00 : shipping;
  const finalTotal = Number(Math.max(0, subtotal - discount + finalShippingCost).toFixed(2));

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '90vh', paddingBottom: '80px' }}>
      {/* Top Header */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--cv-border)', padding: '18px 0' }}>
        <div className="cv-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => onNavigate('carrito')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}
          >
            <ArrowLeft size={16} /> Volver al carrito
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cv-primary)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <Lock size={15} /> Checkout Seguro SSL 256-bit
          </div>
        </div>
      </div>

      <div className="cv-container" style={{ paddingTop: '36px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px', color: 'var(--cv-text-main)' }}>
          Finalizar tu Compra
        </h1>
        <p style={{ color: 'var(--cv-text-muted)', marginBottom: '32px' }}>
          Ingresa los datos para la entrega de tus productos CasaViva y emisión de tu comprobante.
        </p>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
            
            {/* Left Column - Forms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Step 1: Customer Data */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>1</span>
                  Datos del Comprador
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nombres y Apellidos *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={customer.nombre}
                      onChange={e => setCustomer({ ...customer, nombre: e.target.value })}
                      placeholder="Ej. María López"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="maria@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Doc.</label>
                    <select
                      className="form-select"
                      value={customer.tipo_documento}
                      onChange={e => setCustomer({ ...customer, tipo_documento: e.target.value as any })}
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="Pasaporte">Pasap.</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Número de Doc. *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={customer.numero_documento}
                      onChange={e => setCustomer({ ...customer, numero_documento: e.target.value })}
                      placeholder="47589632"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Teléfono / Celular *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={customer.telefono}
                      onChange={e => setCustomer({ ...customer, telefono: e.target.value })}
                      placeholder="987 654 321"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>2</span>
                  Dirección de Entrega
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Departamento *</label>
                    <select
                      className="form-select"
                      value={address.departamento}
                      onChange={e => setAddress({ ...address, departamento: e.target.value })}
                    >
                      <option value="Lima">Lima</option>
                      <option value="Arequipa">Arequipa</option>
                      <option value="Cusco">Cusco</option>
                      <option value="La Libertad">La Libertad (Trujillo)</option>
                      <option value="Piura">Piura</option>
                      <option value="Lambayeque">Lambayeque (Chiclayo)</option>
                      <option value="Ica">Ica</option>
                      <option value="Áncash">Áncash</option>
                      <option value="Otro Departamento">Otro Departamento</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Provincia *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={address.provincia}
                      onChange={e => setAddress({ ...address, provincia: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Distrito *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={address.distrito}
                      onChange={e => setAddress({ ...address, distrito: e.target.value })}
                      placeholder="Ej. Miraflores"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dirección exacta (Calle, Avenida, Número, Dpto) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.direccion}
                    onChange={e => setAddress({ ...address, direccion: e.target.value })}
                    placeholder="Av. Larco 743, Dpto 402"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Referencia de entrega (opcional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.referencia}
                    onChange={e => setAddress({ ...address, referencia: e.target.value })}
                    placeholder="Frente al parque o timbre con nombre"
                  />
                </div>
              </div>

              {/* Step 3: Shipping Method */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>3</span>
                  Método de Envío
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--cv-radius-md)',
                      border: shippingMethod === 'estandar' ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                      backgroundColor: shippingMethod === 'estandar' ? 'var(--cv-primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'estandar'}
                        onChange={() => setShippingMethod('estandar')}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Envío Estándar Regular</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>Entrega en 24 a 48 horas (Lima) / 3 a 5 días (Provincias)</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--cv-primary)' }}>
                      {shipping === 0 ? 'GRATIS' : `S/ ${shipping.toFixed(2)}`}
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--cv-radius-md)',
                      border: shippingMethod === 'express' ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                      backgroundColor: shippingMethod === 'express' ? 'var(--cv-primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Envío Express Mismo Día / 24h</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>Prioridad inmediata de despacho en embalaje reforzado</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--cv-text-main)' }}>
                      S/ 25.00
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>4</span>
                  Método de Pago
                </h3>

                {/* Demo notice alert */}
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--cv-bg-warm)', border: '1px solid var(--cv-border)', borderRadius: 'var(--cv-radius-md)', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>
                  <ShieldCheck size={20} color="var(--cv-primary)" />
                  <span>
                    <strong>Modo Demostración Activo:</strong> Puedes completar el flujo para verificar la generación de comprobante y estado de pedido sin cargos reales a tu tarjeta o cuenta.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: paymentMethod === 'yape' ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                      backgroundColor: paymentMethod === 'yape' ? 'var(--cv-primary-light)' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    <QrCode size={24} color="#7928CA" />
                    <span>Yape / Plin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: paymentMethod === 'tarjeta' ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                      backgroundColor: paymentMethod === 'tarjeta' ? 'var(--cv-primary-light)' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    <CreditCard size={24} color="#53634B" />
                    <span>Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: paymentMethod === 'paypal' ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                      backgroundColor: paymentMethod === 'paypal' ? 'var(--cv-primary-light)' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#003087' }}>P</span>
                    <span>PayPal</span>
                  </button>
                </div>

                {/* Payment detail screens */}
                {paymentMethod === 'yape' && (
                  <div style={{ padding: '20px', backgroundColor: 'var(--cv-bg-warm)', borderRadius: 'var(--cv-radius-md)', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Escanea y Paga con Yape o Plin</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)', marginBottom: '16px' }}>
                      Número oficial CasaViva: <strong>987 654 321</strong> · Titular: <em>CasaViva Perú S.A.C.</em>
                    </p>
                    <div style={{ width: '150px', height: '150px', margin: '0 auto 16px', backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '12px', border: '1px solid var(--cv-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=YAPE-CASAVIVA-DEMO-2026"
                        alt="Código QR Yape CasaViva Demo"
                        style={{ width: '130px', height: '130px' }}
                      />
                    </div>
                    <div className="form-group" style={{ maxWidth: '280px', margin: '0 auto', textAlign: 'left' }}>
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>Código de aprobación o últimos 4 dígitos:</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej. 849302"
                        value={yapeCode}
                        onChange={e => setYapeCode(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'tarjeta' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Número de Tarjeta (Débito o Crédito)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="4557 •••• •••• 1234"
                        value={cardData.numero}
                        onChange={e => setCardData({ ...cardData, numero: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Expiración (MM/AA)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="12/28"
                          value={cardData.expiracion}
                          onChange={e => setCardData({ ...cardData, expiracion: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Código CVV</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="•••"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Nombre impreso en la tarjeta</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Como figura en el plástico"
                        value={cardData.titular}
                        onChange={e => setCardData({ ...cardData, titular: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--cv-bg-warm)', borderRadius: 'var(--cv-radius-md)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginBottom: '14px' }}>
                      Al hacer clic en confirmar pedido, se validará la transacción de forma simulada a través de PayPal Sandbox.
                    </p>
                    <span style={{ display: 'inline-block', backgroundColor: '#FFC439', color: '#111', padding: '10px 24px', borderRadius: '24px', fontWeight: 700, fontSize: '0.9375rem' }}>
                      PayPal Checkout Demo
                    </span>
                  </div>
                )}
              </div>

              {/* Step 5: Invoice / Comprobante */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>5</span>
                  Comprobante de Pago Electrónico
                </h3>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="invoiceType"
                      checked={invoiceType === 'boleta'}
                      onChange={() => setInvoiceType('boleta')}
                    />
                    Boleta de Venta
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="invoiceType"
                      checked={invoiceType === 'factura'}
                      onChange={() => setInvoiceType('factura')}
                    />
                    Factura con RUC
                  </label>
                </div>

                {invoiceType === 'factura' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: 'var(--cv-bg-warm)', borderRadius: '8px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">RUC (11 dígitos) *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="20123456789"
                        maxLength={11}
                        value={billing.ruc}
                        onChange={e => setBilling({ ...billing, ruc: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Razón Social *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Empresa o Negocio S.A.C."
                        value={billing.razon_social}
                        onChange={e => setBilling({ ...billing, razon_social: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Dirección Fiscal</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Av. Principal 123, Oficina 501"
                        value={billing.direccion_fiscal}
                        onChange={e => setBilling({ ...billing, direccion_fiscal: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column - Order Summary */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '24px', boxShadow: 'var(--cv-shadow-sm)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '12px' }}>
                  Resumen del Pedido ({items.length} {items.length === 1 ? 'producto' : 'productos'})
                </h3>

                {/* Items preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
                  {items.map(item => (
                    <div key={item.variante_id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={item.imagen} alt={item.nombre_producto} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.nombre_producto}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>
                          {item.cantidad}x S/ {item.precio_unitario.toFixed(2)} · {item.color_nombre}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        S/ {item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-accent)' }}>
                      <span>Descuento ({appliedCoupon?.codigo})</span>
                      <span>-S/ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                    <span>Costo de envío</span>
                    <span>{finalShippingCost === 0 ? <strong style={{ color: 'var(--cv-primary)' }}>GRATIS</strong> : `S/ ${finalShippingCost.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-light)', fontSize: '0.75rem' }}>
                    <span>Incluye I.G.V. (18%)</span>
                    <span>S/ {(finalTotal * 0.18 / 1.18).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cv-text-main)', borderTop: '1px solid var(--cv-border)', paddingTop: '12px', marginTop: '6px' }}>
                    <span>Total a Pagar</span>
                    <span>S/ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  style={{ width: '100%' }}
                >
                  Confirmar y Pagar S/ {finalTotal.toFixed(2)}
                </Button>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
                  <CheckCircle2 size={14} color="var(--cv-primary)" />
                  Garantía de Satisfacción 30 días CasaViva
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
