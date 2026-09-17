import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { Button } from '../components/ui/Button';
import { CheckCircle, Printer, ArrowRight, Package, Truck, Home, Clock } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderCode: string;
  onNavigate: (page: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderCode, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await orderService.getOrderDetails(orderCode);
        setOrder(res.pedido);
      } catch (err) {
        console.error('Error cargando comprobante:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (orderCode) {
      loadOrder();
    }
  }, [orderCode]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ fontSize: '1.125rem', color: 'var(--cv-text-muted)' }}>Cargando comprobante de tu pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Pedido no encontrado</h2>
        <p style={{ color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
          No pudimos localizar la orden con código "{orderCode}".
        </p>
        <Button variant="primary" onClick={() => onNavigate('home')}>
          Ir al Inicio
        </Button>
      </div>
    );
  }

  const steps = [
    { label: 'Pedido Confirmado', icon: <CheckCircle size={18} />, active: true, done: true },
    { label: 'En Preparación', icon: <Package size={18} />, active: order.estado_pedido !== 'Pendiente', done: order.estado_pedido === 'Enviado' || order.estado_pedido === 'Entregado' },
    { label: 'En Camino (Courier)', icon: <Truck size={18} />, active: order.estado_pedido === 'Enviado' || order.estado_pedido === 'Entregado', done: order.estado_pedido === 'Entregado' },
    { label: 'Entregado en Destino', icon: <Home size={18} />, active: order.estado_pedido === 'Entregado', done: order.estado_pedido === 'Entregado' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '90vh', padding: '48px 0 80px' }}>
      <div className="cv-container" style={{ maxWidth: '840px' }}>
        
        {/* Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }} className="no-print">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--cv-shadow-md)' }}>
            <CheckCircle size={36} />
          </div>
          <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--cv-primary)', fontWeight: 600 }}>
            ¡Compra Exitosa!
          </span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--cv-text-main)', marginTop: '4px', marginBottom: '8px' }}>
            Gracias por elegir CasaViva
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--cv-text-muted)' }}>
            Hemos recibido tu orden <strong>{order.codigo_orden}</strong>. Se ha enviado una copia de tu comprobante a <strong>{order.datos_cliente.email}</strong>.
          </p>
        </div>

        {/* Order Status Timeline */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '24px', marginBottom: '32px' }} className="no-print">
          <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-light)', marginBottom: '18px' }}>
            Estado de Despacho en Tiempo Real: <strong style={{ color: 'var(--cv-primary)', textTransform: 'none' }}>{order.estado_pedido}</strong>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            {steps.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: s.done ? 'var(--cv-primary)' : s.active ? 'var(--cv-primary-light)' : 'var(--cv-bg-warm)',
                    color: s.done ? '#FFFFFF' : s.active ? 'var(--cv-primary)' : 'var(--cv-text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.icon}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: s.active ? 600 : 400, color: s.active ? 'var(--cv-text-main)' : 'var(--cv-text-light)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Official Electronic Receipt / Comprobante */}
        <div
          id="print-receipt"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--cv-radius-lg)',
            border: '1px solid var(--cv-border)',
            padding: '40px',
            boxShadow: 'var(--cv-shadow-md)',
            marginBottom: '32px',
          }}
        >
          {/* Header of Receipt */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--cv-text-main)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--cv-text-main)', margin: 0 }}>
                CasaViva Perú S.A.C.
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)', margin: '4px 0 0' }}>
                RUC: 20608945123 · Av. Paseo de la República 3245, San Isidro, Lima<br />
                Venta online de productos del hogar, diseño y decoración
              </p>
            </div>
            <div style={{ textAlign: 'right', border: '1px solid var(--cv-border)', padding: '12px 18px', borderRadius: '8px', backgroundColor: 'var(--cv-bg-warm)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-primary)' }}>
                {order.tipo_comprobante === 'factura' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cv-text-main)', marginTop: '2px' }}>
                {order.codigo_orden}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>
                Fecha: {new Date(order.creado_en).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Data */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px', fontSize: '0.875rem' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-light)', marginBottom: '8px' }}>
                Datos del Cliente
              </h4>
              <div style={{ fontWeight: 600, color: 'var(--cv-text-main)' }}>{order.datos_cliente.nombre}</div>
              <div style={{ color: 'var(--cv-text-muted)' }}>{order.datos_cliente.tipo_documento}: {order.datos_cliente.numero_documento}</div>
              <div style={{ color: 'var(--cv-text-muted)' }}>Email: {order.datos_cliente.email}</div>
              <div style={{ color: 'var(--cv-text-muted)' }}>Teléfono: {order.datos_cliente.telefono}</div>

              {order.tipo_comprobante === 'factura' && order.datos_facturacion && (
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'var(--cv-bg-warm)', borderRadius: '4px', fontSize: '0.8125rem' }}>
                  <strong>RUC:</strong> {order.datos_facturacion.ruc}<br />
                  <strong>Razón Social:</strong> {order.datos_facturacion.razon_social}
                </div>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-light)', marginBottom: '8px' }}>
                Dirección de Entrega
              </h4>
              <div style={{ fontWeight: 600, color: 'var(--cv-text-main)' }}>{order.direccion_envio.direccion}</div>
              <div style={{ color: 'var(--cv-text-muted)' }}>{order.direccion_envio.distrito}, {order.direccion_envio.provincia}, {order.direccion_envio.departamento}</div>
              {order.direccion_envio.referencia && (
                <div style={{ color: 'var(--cv-text-muted)', fontSize: '0.8125rem' }}>Ref: {order.direccion_envio.referencia}</div>
              )}
              <div style={{ marginTop: '6px', color: 'var(--cv-text-muted)' }}>
                <strong>Método de pago:</strong> {order.metodo_pago.toUpperCase()} ({order.estado_pago === 'simulado' ? 'Simulado Demo' : 'Confirmado'})
              </div>
            </div>
          </div>

          {/* Table of items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--cv-border)', backgroundColor: 'var(--cv-bg-warm)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Descripción</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Color / Acabado</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Cant.</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>P. Unitario</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--cv-border-subtle)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 500 }}>
                    {item.nombre_producto}
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>SKU: {item.sku}</span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--cv-text-muted)' }}>
                    {item.color_nombre}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 600 }}>
                    {item.cantidad}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    S/ {item.precio_unitario.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>
                    S/ {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.875rem' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                <span>Subtotal (Op. Gravada):</span>
                <span>S/ {(order.total / 1.18).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                <span>I.G.V. (18%):</span>
                <span>S/ {(order.total - (order.total / 1.18)).toFixed(2)}</span>
              </div>
              {order.descuento > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-accent)' }}>
                  <span>Descuento aplicado:</span>
                  <span>-S/ {order.descuento.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cv-text-muted)' }}>
                <span>Costo de envío:</span>
                <span>{order.costo_envio === 0 ? 'GRATIS' : `S/ ${order.costo_envio.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cv-text-main)', borderTop: '2px solid var(--cv-text-main)', paddingTop: '8px', marginTop: '4px' }}>
                <span>TOTAL A PAGAR:</span>
                <span>S/ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px dashed var(--cv-border)', fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
            Autorización de emisión electrónica SUNAT · Representación impresa de {order.tipo_comprobante.toUpperCase()} electrónica · CasaViva Perú
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }} className="no-print">
          <Button variant="secondary" size="md" icon={<Printer size={16} />} onClick={handlePrint}>
            Imprimir Comprobante
          </Button>
          <Button variant="primary" size="md" onClick={() => onNavigate('catalogo')}>
            Seguir Comprando <ArrowRight size={16} />
          </Button>
          <Button variant="outline" size="md" onClick={() => onNavigate('cuenta', 'pedidos')}>
            Ver en Mis Pedidos
          </Button>
        </div>

      </div>

      <style>{`
        @media print {
          body { background-color: #FFFFFF !important; }
          header, footer, .no-print, .chatbot-window, button { display: none !important; }
          #print-receipt { border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};
