import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ChevronDown, ShieldCheck, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';

interface HeaderProps {
  onNavigate: (page: string, param?: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { totalItems, subtotal, setIsDrawerOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productService.getProducts({ busqueda: searchQuery, limite: 5 });
        setSearchResults(res.productos);
        setShowSearchDropdown(true);
      } catch (e) {
        console.error('Error buscando productos:', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate('catalogo', `busqueda=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navCategories = [
    { label: 'Catálogo', page: 'catalogo', filter: '' },
    { label: 'Sala', page: 'catalogo', filter: 'cat-sala' },
    { label: 'Dormitorio', page: 'catalogo', filter: 'cat-dormitorio' },
    { label: 'Cocina & Comedor', page: 'catalogo', filter: 'cat-cocina' },
    { label: 'Baño', page: 'catalogo', filter: 'cat-bano' },
    { label: 'Decoración', page: 'catalogo', filter: 'cat-decoracion' },
    { label: 'Organización', page: 'catalogo', filter: 'cat-organizacion' },
    { label: 'Iluminación', page: 'catalogo', filter: 'cat-iluminacion' },
    { label: 'Bajo S/ 100', page: 'catalogo', filter: 'bajo_100' },
    { label: 'Ofertas', page: 'catalogo', filter: 'ofertas' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 900, backgroundColor: 'rgba(250, 248, 245, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--cv-border)' }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', fontSize: '0.8125rem', padding: '6px 16px', textAlign: 'center', letterSpacing: '0.03em' }}>
        <span>🌿 Envíos gratis a todo el Perú por compras desde <strong>S/ 199</strong> | 15% OFF con cupón <strong>BIENVENIDO15</strong></span>
      </div>

      {/* Main Bar */}
      <div className="cv-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px', gap: '24px' }}>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ display: 'none', padding: '8px', color: 'var(--cv-text-main)' }}
          className="mobile-only-btn"
          aria-label="Abrir menú"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>CV</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--cv-text-main)' }}>
              CasaViva
            </span>
            <span style={{ display: 'block', fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cv-text-light)', marginTop: '-4px' }}>
              Hogar & Diseño
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} style={{ flex: 1, maxWidth: '520px', position: 'relative' }} className="desktop-search">
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar sofás de lino, lámparas, organizadores..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              style={{
                width: '100%',
                padding: '10px 42px 10px 16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--cv-border)',
                borderRadius: 'var(--cv-radius-full)',
                fontSize: '0.875rem',
                outline: 'none',
                color: 'var(--cv-text-main)',
                boxShadow: 'var(--cv-shadow-sm)',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--cv-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--cv-radius-md)',
                boxShadow: 'var(--cv-shadow-lg)',
                border: '1px solid var(--cv-border)',
                padding: '12px 0',
                zIndex: 1000,
                maxHeight: '380px',
                overflowY: 'auto',
              }}
            >
              {isSearching ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
                  Buscando en catálogo...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div style={{ padding: '4px 16px 8px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-light)', borderBottom: '1px solid var(--cv-border-subtle)' }}>
                    Productos sugeridos
                  </div>
                  {searchResults.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                        onNavigate('producto', prod.slug || prod.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--cv-border-subtle)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--cv-bg-warm)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <img
                        src={prod.imagen_principal}
                        alt={prod.nombre}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--cv-text-main)' }}>{prod.nombre}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>{prod.categoria_nombre} · {prod.marca}</div>
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cv-primary)' }}>
                        S/ {prod.precio_base.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleSearchSubmit}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.8125rem',
                      color: 'var(--cv-primary)',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'var(--cv-bg-warm)',
                    }}
                  >
                    Ver todos los resultados para "{searchQuery}" →
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
                  No se encontraron productos para "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* User, Wishlist & Cart Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* User Account Menu */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--cv-radius-full)',
                backgroundColor: isUserMenuOpen ? 'var(--cv-bg-warm)' : 'transparent',
                color: 'var(--cv-text-main)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
              aria-label="Menú de usuario"
            >
              <UserIcon size={20} />
              <span className="desktop-text">
                {isAuthenticated ? user?.nombre.split(' ')[0] : 'Mi Cuenta'}
              </span>
              <ChevronDown size={14} />
            </button>

            {isUserMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--cv-radius-md)',
                  boxShadow: 'var(--cv-shadow-lg)',
                  border: '1px solid var(--cv-border)',
                  padding: '8px 0',
                  zIndex: 1000,
                  animation: 'fadeInPop 0.2s ease forwards',
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--cv-border-subtle)', backgroundColor: 'var(--cv-bg-warm)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cv-text-main)' }}>{user?.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)' }}>{user?.email}</div>
                      {isAdmin && (
                        <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.6875rem', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          Administrador
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('cuenta', 'perfil'); }}
                      style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <UserIcon size={16} /> Mi Perfil y Direcciones
                    </div>
                    <div
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('cuenta', 'pedidos'); }}
                      style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Package size={16} /> Mis Pedidos
                    </div>
                    <div
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('cuenta', 'favoritos'); }}
                      style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Heart size={16} /> Mis Favoritos ({wishlistCount})
                    </div>
                    {isAdmin && (
                      <div
                        onClick={() => { setIsUserMenuOpen(false); onNavigate('admin'); }}
                        style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cv-primary)', fontWeight: 600, borderTop: '1px solid var(--cv-border-subtle)' }}
                      >
                        <LayoutDashboard size={16} /> Panel Administrador
                      </div>
                    )}
                    <div
                      onClick={() => { setIsUserMenuOpen(false); logout(); onNavigate('home'); }}
                      style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#C45E3D', borderTop: '1px solid var(--cv-border-subtle)' }}
                    >
                      <LogOut size={16} /> Cerrar Sesión
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('login'); }}
                      style={{ padding: '12px 16px', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, color: 'var(--cv-primary)' }}
                    >
                      Iniciar Sesión
                    </div>
                    <div
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('registro'); }}
                      style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', color: 'var(--cv-text-main)' }}
                    >
                      Crear Cuenta Nueva
                    </div>
                    <div
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('admin'); }}
                      style={{ padding: '10px 16px', fontSize: '0.8125rem', cursor: 'pointer', color: 'var(--cv-text-muted)', borderTop: '1px solid var(--cv-border-subtle)' }}
                    >
                      Acceso Administrador (Demo)
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => onNavigate('cuenta', 'favoritos')}
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: '50%',
              color: 'var(--cv-text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Favoritos"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: 'var(--cv-accent)',
                  color: '#FFFFFF',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--cv-primary)',
              color: '#FFFFFF',
              padding: '9px 16px',
              borderRadius: 'var(--cv-radius-full)',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: 'var(--cv-shadow-sm)',
            }}
            aria-label="Abrir carrito"
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: 'var(--cv-accent)',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </div>
            <span className="desktop-text" style={{ letterSpacing: '0.02em' }}>
              S/ {subtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav style={{ borderTop: '1px solid var(--cv-border-subtle)', backgroundColor: 'var(--cv-bg-warm)' }} className="desktop-nav">
        <div className="cv-container" style={{ display: 'flex', alignItems: 'center', gap: '28px', height: '44px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {navCategories.map(cat => {
            const isActive = currentPage === cat.page && (cat.filter ? window.location.hash.includes(cat.filter) : true);
            const isCatalogLink = cat.label === 'Catálogo';

            return (
              <button
                key={cat.label}
                onClick={() => onNavigate(cat.page, cat.filter ? `categoria=${cat.filter}` : '')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: isCatalogLink ? 600 : 500,
                  color: isCatalogLink ? 'var(--cv-primary)' : 'var(--cv-text-main)',
                  padding: '4px 0',
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderBottom: isActive ? '2px solid var(--cv-primary)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.label}
                {cat.label === 'Ofertas' && (
                  <span style={{ fontSize: '0.625rem', backgroundColor: 'var(--cv-accent)', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    HOT
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '110px',
            backgroundColor: '#FFFFFF',
            zIndex: 850,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--cv-border)' }}
              />
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {navCategories.map(cat => (
              <button
                key={cat.label}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate(cat.page, cat.filter ? `categoria=${cat.filter}` : '');
                }}
                style={{
                  textAlign: 'left',
                  fontSize: '1.0625rem',
                  fontWeight: 500,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--cv-border-subtle)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-search { display: none !important; }
          .desktop-text { display: none !important; }
          .desktop-nav { display: none !important; }
          .mobile-only-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
