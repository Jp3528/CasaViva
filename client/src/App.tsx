import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/ui/ToastContainer';
import { FloatingChatbot } from './components/chatbot/FloatingChatbot';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string>('');

  // Synchronize hash with page router
  const parseHash = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    const parts = hash.split('?');
    const route = parts[0];
    const query = parts[1] || '';

    if (route.startsWith('producto/')) {
      setCurrentPage('producto');
      setPageParam(route.replace('producto/', ''));
    } else if (route.startsWith('pedido-confirmado/')) {
      setCurrentPage('pedido-confirmado');
      setPageParam(route.replace('pedido-confirmado/', ''));
    } else {
      setCurrentPage(route || 'home');
      setPageParam(query);
    }
  };

  useEffect(() => {
    parseHash();
    const handleHashChange = () => parseHash();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setPageParam(param || '');

    if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'producto' && param) {
      window.location.hash = `producto/${param}`;
    } else if (page === 'pedido-confirmado' && param) {
      window.location.hash = `pedido-confirmado/${param}`;
    } else if (param) {
      window.location.hash = `${page}?${param}`;
    } else {
      window.location.hash = page;
    }

    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <CartDrawer onNavigate={handleNavigate} />
      <ToastContainer />

      <main style={{ flex: 1 }}>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'catalogo' && <CatalogPage initialFilter={pageParam} onNavigate={handleNavigate} />}
        {currentPage === 'producto' && <ProductDetailPage idOrSlug={pageParam} onNavigate={handleNavigate} />}
        {currentPage === 'carrito' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
        {currentPage === 'pedido-confirmado' && <OrderConfirmationPage orderCode={pageParam} onNavigate={handleNavigate} />}
        {currentPage === 'cuenta' && <AccountPage initialTab={pageParam || 'perfil'} onNavigate={handleNavigate} />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'registro' && <RegisterPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
      </main>

      <FloatingChatbot onNavigate={handleNavigate} />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
