import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { User, Address, Order, Product } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProductCard } from '../components/product/ProductCard';
import { User as UserIcon, MapPin, Package, Heart, LogOut, Plus, Trash2, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';

interface AccountPageProps {
  initialTab?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'perfil', onNavigate }) => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { wishlistIds } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Address modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    nombre_destinatario: user?.nombre || '',
    telefono: user?.telefono || '',
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: '',
    direccion: '',
    referencia: '',
    es_principal: false,
  });

  // Profile edit
  const [profileForm, setProfileForm] = useState({
    nombre: user?.nombre || '',
    telefono: user?.telefono || '',
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadUserData = async () => {
      setIsLoadingData(true);
      try {
        const [addrRes, orderRes] = await Promise.all([
          authService.getAddresses(user.id),
          orderService.getUserOrders(user.id),
        ]);
        setAddresses(addrRes.direcciones || []);
        setOrders(orderRes.pedidos || []);
      } catch (err) {
        console.error('Error cargando datos de usuario:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user]);

  // Load wishlist products
  useEffect(() => {
    const loadWishlist = async () => {
      if (wishlistIds.length === 0) {
        setWishlistProducts([]);
        return;
      }
      try {
        const prods: Product[] = [];
        for (const id of wishlistIds) {
          const res = await productService.getProductBySlugOrId(id);
          if (res.producto) prods.push(res.producto);
        }
        setWishlistProducts(prods);
      } catch (err) {
        console.error('Error cargando favoritos:', err);
      }
    };
    loadWishlist();
  }, [wishlistIds]);

  if (!isAuthenticated) {
    return (
      <div className="cv-container cv-section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cv-bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShieldAlert size={28} color="var(--cv-primary)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Inicia sesión para ver tu cuenta</h2>
        <p style={{ color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
          Accede a tu historial de compras, libreta de direcciones y lista de favoritos.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button variant="primary" size="md" onClick={() => onNavigate('login')}>
            Iniciar Sesión
          </Button>
          <Button variant="secondary" size="md" onClick={() => onNavigate('registro')}>
            Crear Cuenta Nueva
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ nombre: profileForm.nombre, telefono: profileForm.telefono });
    showToast('Perfil actualizado correctamente', 'exito');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.direccion || !newAddress.distrito) {
      showToast('Completa la dirección y distrito', 'error');
      return;
    }

    try {
      const res = await authService.addAddress(user!.id, newAddress);
      setAddresses(prev => [...prev, res.direccion]);
      setIsAddressModalOpen(false);
      showToast('Dirección guardada exitosamente', 'exito');
      setNewAddress({
        nombre_destinatario: user?.nombre || '',
        telefono: user?.telefono || '',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: '',
        direccion: '',
        referencia: '',
        es_principal: false,
      });
    } catch (err: any) {
      showToast(err.message || 'Error al guardar dirección', 'error');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await authService.deleteAddress(user!.id, addressId);
      setAddresses(prev => prev.filter(a => a.id !== addressId));
      showToast('Dirección eliminada', 'info');
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await authService.setDefaultAddress(user!.id, addressId);
      setAddresses(prev =>
        prev.map(a => ({
          ...a,
          es_principal: a.id === addressId,
        }))
      );
      showToast('Dirección principal actualizada', 'exito');
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar', 'error');
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: <UserIcon size={18} /> },
    { id: 'direcciones', label: 'Mis Direcciones', icon: <MapPin size={18} /> },
    { id: 'pedidos', label: 'Mis Pedidos', icon: <Package size={18} /> },
    { id: 'favoritos', label: `Favoritos (${wishlistIds.length})`, icon: <Heart size={18} /> },
  ];

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '90vh', padding: '48px 0 80px' }}>
      <div className="cv-container">
        
        {/* Profile Banner */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '28px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
              {user?.nombre.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--cv-text-main)', margin: 0 }}>
                {user?.nombre}
              </h2>
              <span style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
                {user?.email} · Rol: {user?.rol === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<LogOut size={16} />} onClick={() => { logout(); onNavigate('home'); }}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Account Tabs & Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', alignItems: 'start' }} className="account-grid">
          
          {/* Navigation Sidebar */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(t => {
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: 'var(--cv-radius-md)',
                    fontSize: '0.9375rem',
                    fontWeight: isSelected ? 600 : 500,
                    backgroundColor: isSelected ? 'var(--cv-primary-light)' : 'transparent',
                    color: isSelected ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-lg)', border: '1px solid var(--cv-border)', padding: '32px' }}>
            
            {/* TAB: Perfil */}
            {activeTab === 'perfil' && (
              <div>
                <h3 style={{ fontSize: '1.375rem', marginBottom: '20px' }}>Información Personal</h3>
                <form onSubmit={handleUpdateProfile} style={{ maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.nombre}
                      onChange={e => setProfileForm({ ...profileForm, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Correo Electrónico (No modificable)</label>
                    <input
                      type="email"
                      className="form-input"
                      value={user?.email}
                      disabled
                      style={{ backgroundColor: 'var(--cv-bg-warm)', opacity: 0.8 }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profileForm.telefono}
                      onChange={e => setProfileForm({ ...profileForm, telefono: e.target.value })}
                      placeholder="987 654 321"
                    />
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <Button type="submit" variant="primary" size="md">
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Direcciones */}
            {activeTab === 'direcciones' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.375rem', margin: 0 }}>Libreta de Direcciones</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', margin: '4px 0 0' }}>
                      Administra tus lugares frecuentes de entrega.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setIsAddressModalOpen(true)}>
                    Nueva Dirección
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px', backgroundColor: 'var(--cv-bg-warm)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--cv-text-muted)', marginBottom: '16px' }}>No tienes direcciones guardadas aún.</p>
                    <Button variant="secondary" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                      Agregar tu primera dirección
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        style={{
                          padding: '20px',
                          borderRadius: 'var(--cv-radius-md)',
                          border: addr.es_principal ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                          backgroundColor: addr.es_principal ? 'var(--cv-primary-light)' : '#FFFFFF',
                          position: 'relative',
                        }}
                      >
                        {addr.es_principal && (
                          <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.6875rem', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            Principal
                          </span>
                        )}
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cv-text-main)', marginBottom: '6px' }}>
                          {addr.nombre_destinatario}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', lineHeight: 1.4, marginBottom: '8px' }}>
                          {addr.direccion}<br />
                          {addr.distrito}, {addr.provincia}, {addr.departamento}<br />
                          Tel: {addr.telefono}
                        </p>
                        {addr.referencia && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--cv-text-light)', fontStyle: 'italic', marginBottom: '12px' }}>
                            Ref: {addr.referencia}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '10px' }}>
                          {!addr.es_principal && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              style={{ fontSize: '0.75rem', color: 'var(--cv-primary)', fontWeight: 600 }}
                            >
                              Marcar como principal
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            style={{ fontSize: '0.75rem', color: '#C45E3D', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={13} /> Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <h3 style={{ fontSize: '1.375rem', marginBottom: '8px' }}>Historial de Pedidos</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
                  Revisa el estado de tus compras y descarga tus comprobantes electrónicos.
                </p>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <p style={{ color: 'var(--cv-text-muted)', marginBottom: '16px' }}>No has realizado pedidos aún.</p>
                    <Button variant="primary" size="md" onClick={() => onNavigate('catalogo')}>
                      Empezar a comprar
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map(order => (
                      <div
                        key={order.id}
                        style={{
                          border: '1px solid var(--cv-border)',
                          borderRadius: 'var(--cv-radius-md)',
                          padding: '20px',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--cv-text-main)' }}>
                              {order.codigo_orden}
                            </span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)', marginLeft: '12px' }}>
                              Fecha: {new Date(order.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '4px',
                                backgroundColor: order.estado_pedido === 'Entregado' ? 'var(--cv-primary-light)' : order.estado_pedido === 'Cancelado' ? '#FEE2E2' : '#FEF3D6',
                                color: order.estado_pedido === 'Entregado' ? 'var(--cv-primary)' : order.estado_pedido === 'Cancelado' ? '#DC2626' : '#B45309',
                              }}
                            >
                              {order.estado_pedido}
                            </span>
                            <button
                              onClick={() => onNavigate('pedido-confirmado', order.codigo_orden)}
                              style={{ fontSize: '0.8125rem', color: 'var(--cv-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={14} /> Ver Boleta
                            </button>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={item.imagen} alt={item.nombre_producto} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.nombre_producto}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>{item.cantidad}x · {item.color_nombre}</div>
                              </div>
                              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>S/ {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '10px', fontSize: '0.875rem' }}>
                          <span style={{ color: 'var(--cv-text-muted)' }}>
                            Envío: {order.direccion_envio.distrito}, {order.direccion_envio.provincia}
                          </span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cv-primary)' }}>
                            Total: S/ {order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Favoritos */}
            {activeTab === 'favoritos' && (
              <div>
                <h3 style={{ fontSize: '1.375rem', marginBottom: '8px' }}>Mis Productos Favoritos</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginBottom: '24px' }}>
                  Guarda las piezas que inspiran tu hogar para comprarlas cuando lo desees.
                </p>

                {wishlistProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <p style={{ color: 'var(--cv-text-muted)', marginBottom: '16px' }}>No tienes productos en tu lista de deseos todavía.</p>
                    <Button variant="primary" size="md" onClick={() => onNavigate('catalogo')}>
                      Explorar Catálogo
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                    {wishlistProducts.map(p => (
                      <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* New Address Modal */}
      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Agregar Nueva Dirección">
        <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nombre de quien recibe *</label>
            <input
              type="text"
              className="form-input"
              value={newAddress.nombre_destinatario}
              onChange={e => setNewAddress({ ...newAddress, nombre_destinatario: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Teléfono de contacto *</label>
            <input
              type="tel"
              className="form-input"
              value={newAddress.telefono}
              onChange={e => setNewAddress({ ...newAddress, telefono: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Departamento</label>
              <input
                type="text"
                className="form-input"
                value={newAddress.departamento}
                onChange={e => setNewAddress({ ...newAddress, departamento: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Distrito *</label>
              <input
                type="text"
                className="form-input"
                value={newAddress.distrito}
                onChange={e => setNewAddress({ ...newAddress, distrito: e.target.value })}
                placeholder="Ej. San Isidro"
                required
              />
            </div>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Dirección (Calle, Número, Dpto) *</label>
            <input
              type="text"
              className="form-input"
              value={newAddress.direccion}
              onChange={e => setNewAddress({ ...newAddress, direccion: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Referencia</label>
            <input
              type="text"
              className="form-input"
              value={newAddress.referencia}
              onChange={e => setNewAddress({ ...newAddress, referencia: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsAddressModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Dirección
            </Button>
          </div>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .account-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
