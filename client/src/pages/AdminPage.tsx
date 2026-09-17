import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { subscriberService } from '../services/subscriberService';
import { couponService } from '../services/couponService';
import { Product, ProductVariant, Order, Subscriber, Coupon, AdminStats, OrderState } from '../types';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  DollarSign,
  TrendingUp,
  Save,
  CheckCircle2,
  Edit2,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'metricas' | 'productos' | 'pedidos' | 'suscriptores' | 'cupones'>('metricas');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({});

  // Edit product modal / state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editPrevPrice, setEditPrevPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editState, setEditState] = useState<any>('Nuevo');
  const [editActive, setEditActive] = useState<boolean>(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Edit variant stock modal / state
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantStock, setVariantStock] = useState<number>(0);
  const [variantPriceAdd, setVariantPriceAdd] = useState<number>(0);
  const [isSavingVariant, setIsSavingVariant] = useState(false);

  // New Coupon modal
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    codigo: '',
    tipo_descuento: 'porcentaje' as 'porcentaje' | 'monto_fijo',
    valor: 10,
    compra_minima: 50,
    limite_uso: 100,
    descripcion: '',
  });

  const { showToast } = useToast();

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, prodsRes, ordRes, subsRes, coupRes] = await Promise.all([
        orderService.getAdminStats(),
        productService.getAdminProducts(),
        orderService.getAllOrders(),
        subscriberService.getAllSubscribers(),
        couponService.getAllCoupons(),
      ]);

      setStats(statsRes.metricas);
      setProducts(prodsRes.productos || []);
      setOrders(ordRes.pedidos || []);
      setSubscribers(subsRes.suscriptores || []);
      setCoupons(coupRes.cupones || []);
    } catch (err: any) {
      showToast('Error cargando datos administrativos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const toggleExpand = (productId: string) => {
    setExpandedProductIds(prev => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Product edit handler
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditPrice(prod.precio_base);
    setEditPrevPrice(prod.precio_anterior || 0);
    setEditDiscount(prod.descuento_porcentaje || 0);
    setEditState(prod.estado);
    setEditActive(prod.activo);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingProduct(true);
    try {
      const res = await productService.updateProductPriceAndStatus(editingProduct.id, {
        precio_base: Number(editPrice),
        precio_anterior: editPrevPrice > 0 ? Number(editPrevPrice) : undefined,
        descuento_porcentaje: Number(editDiscount),
        estado: editState,
        activo: editActive,
      });

      setProducts(prev => prev.map(p => (p.id === editingProduct.id ? res.producto : p)));
      showToast(`Producto "${res.producto.nombre}" actualizado con éxito`, 'exito', 'Cambios guardados');
      setEditingProduct(null);
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar producto', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Variant edit handler
  const handleOpenEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantStock(variant.stock);
    setVariantPriceAdd(variant.precio_adicional || 0);
  };

  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    setIsSavingVariant(true);
    try {
      const res = await productService.updateVariantStock(editingVariant.id, {
        stock: Number(variantStock),
        precio_adicional: Number(variantPriceAdd),
      });

      setProducts(prev =>
        prev.map(p => {
          if (p.id === editingVariant.producto_id) {
            return {
              ...p,
              variantes: p.variantes.map(v => (v.id === editingVariant.id ? res.variante : v)),
            };
          }
          return p;
        })
      );

      showToast(`Stock de "${res.variante.nombre_variante}" actualizado a ${res.variante.stock} unidades`, 'exito');
      setEditingVariant(null);
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar stock', 'error');
    } finally {
      setIsSavingVariant(false);
    }
  };

  // Order status update
  const handleOrderStatusChange = async (orderId: string, newStatus: OrderState) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId || o.codigo_orden === orderId ? res.pedido : o)));
      showToast(res.message, 'exito', 'Estado actualizado');
    } catch (err: any) {
      showToast(err.message || 'Error al cambiar estado', 'error');
    }
  };

  // Toggle Coupon status
  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    try {
      const res = await couponService.toggleCoupon(id, !currentActive);
      setCoupons(prev => prev.map(c => (c.id === id ? res.cupon : c)));
      showToast(res.message, 'info');
    } catch (err: any) {
      showToast(err.message || 'Error al modificar cupón', 'error');
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.codigo) return;

    try {
      const res = await couponService.createCoupon(newCoupon);
      setCoupons(prev => [...prev, res.cupon]);
      showToast(`Cupón ${res.cupon.codigo} creado con éxito`, 'exito');
      setIsNewCouponOpen(false);
      setNewCoupon({
        codigo: '',
        tipo_descuento: 'porcentaje',
        valor: 10,
        compra_minima: 50,
        limite_uso: 100,
        descripcion: '',
      });
    } catch (err: any) {
      showToast(err.message || 'Error al crear cupón', 'error');
    }
  };

  const tabs = [
    { id: 'metricas', label: 'Dashboard & Métricas', icon: <LayoutDashboard size={18} /> },
    { id: 'productos', label: `Gestión de Productos (${products.length})`, icon: <Package size={18} /> },
    { id: 'pedidos', label: `Pedidos y Ventas (${orders.length})`, icon: <ShoppingBag size={18} /> },
    { id: 'suscriptores', label: `Suscriptores (${subscribers.length})`, icon: <Users size={18} /> },
    { id: 'cupones', label: `Cupones (${coupons.length})`, icon: <Tag size={18} /> },
  ];

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '90vh', padding: '36px 0 80px' }}>
      <div className="cv-container">
        
        {/* Admin Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
              Panel de Control CasaViva
            </div>
            <h1 style={{ fontSize: '2.25rem', color: 'var(--cv-text-main)', margin: '4px 0 0' }}>
              Administración de Tienda
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" size="sm" icon={<RefreshCw size={15} />} onClick={loadAllAdminData}>
              Actualizar Datos
            </Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate('catalogo')}>
              Ver Tienda en Vivo
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
          {tabs.map(t => {
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--cv-radius-md)',
                  backgroundColor: isSelected ? 'var(--cv-primary)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--cv-text-main)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.875rem',
                  border: isSelected ? '1px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                  boxShadow: 'var(--cv-shadow-sm)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Métricas & Dashboard */}
        {activeTab === 'metricas' && stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', boxShadow: 'var(--cv-shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--cv-text-light)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ventas Totales</span>
                  <DollarSign size={20} color="var(--cv-primary)" />
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                  S/ {stats.ventas_totales.toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--cv-primary)', display: 'block', marginTop: '4px' }}>
                  En soles peruanos
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', boxShadow: 'var(--cv-shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--cv-text-light)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedidos Registrados</span>
                  <ShoppingBag size={20} color="var(--cv-primary)" />
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                  {stats.pedidos_totales}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)', display: 'block', marginTop: '4px' }}>
                  {stats.pedidos_hoy} pedidos hoy
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', boxShadow: 'var(--cv-shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--cv-text-light)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Productos Activos</span>
                  <Package size={20} color="var(--cv-primary)" />
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                  {stats.productos_activos}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)', display: 'block', marginTop: '4px' }}>
                  En catálogo online
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', boxShadow: 'var(--cv-shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--cv-text-light)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Promedio</span>
                  <TrendingUp size={20} color="var(--cv-primary)" />
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                  S/ {stats.ticket_promedio.toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)', display: 'block', marginTop: '4px' }}>
                  Por cada compra
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Últimos Pedidos Recibidos</h3>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('pedidos')}>
                  Ver Todos los Pedidos
                </Button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--cv-border)', backgroundColor: 'var(--cv-bg-warm)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px' }}>Código</th>
                      <th style={{ padding: '10px 14px' }}>Cliente</th>
                      <th style={{ padding: '10px 14px' }}>Comprobante</th>
                      <th style={{ padding: '10px 14px' }}>Total</th>
                      <th style={{ padding: '10px 14px' }}>Estado</th>
                      <th style={{ padding: '10px 14px' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--cv-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--cv-primary)' }}>{o.codigo_orden}</td>
                        <td style={{ padding: '12px 14px' }}>{o.datos_cliente.nombre}</td>
                        <td style={{ padding: '12px 14px', textTransform: 'uppercase' }}>{o.tipo_comprobante}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>S/ {o.total.toFixed(2)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--cv-primary-light)', color: 'var(--cv-primary)', fontWeight: 600 }}>
                            {o.estado_pedido}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--cv-text-muted)' }}>
                          {new Date(o.creado_en).toLocaleDateString('es-PE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Gestión de Productos (Grouped base products with nested variants) */}
        {activeTab === 'productos' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.375rem', margin: 0 }}>Catálogo de Productos</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', margin: '4px 0 0' }}>
                  Cada producto base se muestra una sola vez con sus variantes agrupadas en su interior.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {products.map(prod => {
                const isExpanded = !!expandedProductIds[prod.id];
                const totalStock = prod.variantes.reduce((sum, v) => sum + v.stock, 0);

                return (
                  <div
                    key={prod.id}
                    style={{
                      border: '1px solid var(--cv-border)',
                      borderRadius: 'var(--cv-radius-md)',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Base Product Row */}
                    <div
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        backgroundColor: isExpanded ? 'var(--cv-bg-warm)' : '#FFFFFF',
                        borderBottom: isExpanded ? '1px solid var(--cv-border)' : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleExpand(prod.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
                        <button style={{ color: 'var(--cv-text-muted)' }}>
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <img
                          src={prod.imagen_principal}
                          alt={prod.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
                            {prod.categoria_nombre} · {prod.marca}
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cv-text-main)', margin: '2px 0' }}>
                            {prod.nombre}
                          </h4>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>
                            {prod.variantes.length} {prod.variantes.length === 1 ? 'variante' : 'variantes'} · Stock total: <strong>{totalStock} un.</strong>
                          </div>
                        </div>
                      </div>

                      {/* Price & Status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                            S/ {prod.precio_base.toFixed(2)}
                          </span>
                          {prod.precio_anterior && (
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--cv-text-light)', textDecoration: 'line-through' }}>
                              S/ {prod.precio_anterior.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: prod.activo ? 'var(--cv-primary-light)' : '#FEE2E2',
                            color: prod.activo ? 'var(--cv-primary)' : '#DC2626',
                            fontWeight: 600,
                          }}
                        >
                          {prod.activo ? 'Activo' : 'Inactivo'}
                        </span>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenEditProduct(prod);
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                        >
                          <Edit2 size={13} /> Editar Producto
                        </button>
                      </div>
                    </div>

                    {/* Nested Variants Table */}
                    {isExpanded && (
                      <div style={{ padding: '16px 20px 20px 60px', backgroundColor: '#FAF8F5' }}>
                        <h5 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-light)', marginBottom: '10px' }}>
                          Variantes de Color y Stock Individual:
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {prod.variantes.map(v => (
                            <div
                              key={v.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 16px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '6px',
                                border: '1px solid var(--cv-border-subtle)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    backgroundColor: v.color_hex,
                                    border: '1px solid rgba(0,0,0,0.15)',
                                  }}
                                />
                                <div>
                                  <strong style={{ fontSize: '0.875rem' }}>{v.nombre_variante}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-light)', marginLeft: '8px' }}>SKU: {v.sku}</span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ fontSize: '0.875rem' }}>
                                  Stock: <strong style={{ color: v.stock > 0 ? 'var(--cv-primary)' : '#DC2626' }}>{v.stock} un.</strong>
                                </div>
                                {v.precio_adicional > 0 && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>
                                    +S/ {v.precio_adicional.toFixed(2)}
                                  </span>
                                )}
                                <button
                                  onClick={() => handleOpenEditVariant(v)}
                                  style={{ fontSize: '0.8125rem', color: 'var(--cv-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Edit2 size={12} /> Modificar Stock
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Gestión de Pedidos */}
        {activeTab === 'pedidos' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '28px' }}>
            <h3 style={{ fontSize: '1.375rem', marginBottom: '8px' }}>Gestión de Pedidos y Despachos</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
              Actualiza el estado de los pedidos y verifica los datos de facturación de cada cliente.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map(order => (
                <div
                  key={order.id}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--cv-radius-md)',
                    border: '1px solid var(--cv-border)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '12px', marginBottom: '14px' }}>
                    <div>
                      <strong style={{ fontSize: '1.125rem', color: 'var(--cv-text-main)' }}>{order.codigo_orden}</strong>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)', marginLeft: '12px' }}>
                        {new Date(order.creado_en).toLocaleString('es-PE')}
                      </span>
                    </div>

                    {/* Change Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)' }}>Estado:</label>
                      <select
                        value={order.estado_pedido}
                        onChange={e => handleOrderStatusChange(order.id, e.target.value as OrderState)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--cv-border)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          backgroundColor: 'var(--cv-bg-warm)',
                          color: 'var(--cv-text-main)',
                        }}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                      <button
                        onClick={() => onNavigate('pedido-confirmado', order.codigo_orden)}
                        style={{ padding: '6px 10px', fontSize: '0.8125rem', color: 'var(--cv-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} /> Comprobante
                      </button>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Cliente: {order.datos_cliente.nombre}</div>
                      <div style={{ color: 'var(--cv-text-muted)' }}>Doc: {order.datos_cliente.tipo_documento} {order.datos_cliente.numero_documento}</div>
                      <div style={{ color: 'var(--cv-text-muted)' }}>Tel: {order.datos_cliente.telefono} · {order.datos_cliente.email}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>Entrega: {order.metodo_envio}</div>
                      <div style={{ color: 'var(--cv-text-muted)' }}>{order.direccion_envio.direccion}, {order.direccion_envio.distrito}</div>
                      <div style={{ color: 'var(--cv-text-muted)' }}>Pago: {order.metodo_pago.toUpperCase()} ({order.estado_pago})</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--cv-text-muted)' }}>{order.items.length} artículos</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cv-primary)' }}>
                        S/ {order.total.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
                        Comprobante: {order.tipo_comprobante.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Suscriptores */}
        {activeTab === 'suscriptores' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '28px' }}>
            <h3 style={{ fontSize: '1.375rem', marginBottom: '8px' }}>Lista de Suscriptores al Newsletter</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
              Usuarios suscritos que reciben novedades, lanzamientos y el cupón BIENVENIDO15.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--cv-border)', backgroundColor: 'var(--cv-bg-warm)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px' }}>Correo Electrónico</th>
                  <th style={{ padding: '12px 14px' }}>Origen de Captura</th>
                  <th style={{ padding: '12px 14px' }}>Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--cv-border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{sub.email}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--cv-text-muted)' }}>{sub.origen}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--cv-text-light)' }}>
                      {new Date(sub.creado_en).toLocaleString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: Cupones */}
        {activeTab === 'cupones' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.375rem', margin: 0 }}>Cupones de Descuento</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', margin: '4px 0 0' }}>
                  Crea y activa promociones comerciales para el carrito y checkout.
                </p>
              </div>
              <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setIsNewCouponOpen(true)}>
                Crear Cupón
              </Button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--cv-border)', backgroundColor: 'var(--cv-bg-warm)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px' }}>Código</th>
                  <th style={{ padding: '12px 14px' }}>Descuento</th>
                  <th style={{ padding: '12px 14px' }}>Compra Mínima</th>
                  <th style={{ padding: '12px 14px' }}>Usos / Límite</th>
                  <th style={{ padding: '12px 14px' }}>Estado</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--cv-border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--cv-primary)' }}>{c.codigo}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {c.tipo_descuento === 'porcentaje' ? `${c.valor}% OFF` : `S/ ${c.valor.toFixed(2)} OFF`}
                    </td>
                    <td style={{ padding: '12px 14px' }}>S/ {c.compra_minima.toFixed(2)}</td>
                    <td style={{ padding: '12px 14px' }}>{c.usos_actuales} / {c.limite_uso}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: c.activo ? 'var(--cv-primary-light)' : '#FEE2E2',
                          color: c.activo ? 'var(--cv-primary)' : '#DC2626',
                          fontWeight: 600,
                        }}
                      >
                        {c.activo ? 'Activo' : 'Pausado'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleCoupon(c.id, c.activo)}
                        style={{ fontSize: '0.8125rem', color: c.activo ? '#DC2626' : 'var(--cv-primary)', fontWeight: 600 }}
                      >
                        {c.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Edit Product Modal */}
      <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title={`Editar Producto: ${editingProduct?.nombre}`}>
        {editingProduct && (
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Precio Base (S/.) *</label>
                <input
                  type="number"
                  step="0.10"
                  className="form-input"
                  value={editPrice}
                  onChange={e => setEditPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Precio Anterior (S/.)</label>
                <input
                  type="number"
                  step="0.10"
                  className="form-input"
                  value={editPrevPrice}
                  onChange={e => setEditPrevPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">% Descuento Promocional</label>
                <input
                  type="number"
                  className="form-input"
                  value={editDiscount}
                  onChange={e => setEditDiscount(parseInt(e.target.value, 10) || 0)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Estado / Etiqueta</label>
                <select
                  className="form-select"
                  value={editState}
                  onChange={e => setEditState(e.target.value as any)}
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Oferta">Oferta</option>
                  <option value="Selección CasaViva">Selección CasaViva</option>
                  <option value="Más vendido">Más vendido</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={e => setEditActive(e.target.checked)}
                />
                Producto activo y visible en el catálogo público
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setEditingProduct(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" icon={<Save size={16} />} isLoading={isSavingProduct}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Variant Stock Modal */}
      <Modal isOpen={!!editingVariant} onClose={() => setEditingVariant(null)} title={`Stock de Variante: ${editingVariant?.nombre_variante}`}>
        {editingVariant && (
          <form onSubmit={handleSaveVariant} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Unidades en Stock *</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={variantStock}
                onChange={e => setVariantStock(parseInt(e.target.value, 10) || 0)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Precio Adicional por Variante (S/.)</label>
              <input
                type="number"
                step="0.10"
                min="0"
                className="form-input"
                value={variantPriceAdd}
                onChange={e => setVariantPriceAdd(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setEditingVariant(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" icon={<Save size={16} />} isLoading={isSavingVariant}>
                Actualizar Stock
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Coupon Modal */}
      <Modal isOpen={isNewCouponOpen} onClose={() => setIsNewCouponOpen(false)} title="Crear Nuevo Cupón">
        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Código del Cupón *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: OTOÑO20"
              value={newCoupon.codigo}
              onChange={e => setNewCoupon({ ...newCoupon, codigo: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tipo de Descuento</label>
              <select
                className="form-select"
                value={newCoupon.tipo_descuento}
                onChange={e => setNewCoupon({ ...newCoupon, tipo_descuento: e.target.value as any })}
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto_fijo">Monto Fijo (S/.)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Valor del Descuento *</label>
              <input
                type="number"
                step="0.5"
                min="1"
                className="form-input"
                value={newCoupon.valor}
                onChange={e => setNewCoupon({ ...newCoupon, valor: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Compra Mínima (S/.)</label>
              <input
                type="number"
                className="form-input"
                value={newCoupon.compra_minima}
                onChange={e => setNewCoupon({ ...newCoupon, compra_minima: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Límite de Usos</label>
              <input
                type="number"
                className="form-input"
                value={newCoupon.limite_uso}
                onChange={e => setNewCoupon({ ...newCoupon, limite_uso: parseInt(e.target.value, 10) || 100 })}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Descripción para el cliente</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: 20% de descuento en temporada de otoño"
              value={newCoupon.descripcion}
              onChange={e => setNewCoupon({ ...newCoupon, descripcion: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsNewCouponOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Crear Cupón
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
