import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '../types';
import { couponService } from '../services/couponService';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  totalItems: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 199.00;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('casaviva_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('casaviva_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('casaviva_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('casaviva_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('casaviva_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVariant = variant || (product.variantes && product.variantes.length > 0 ? product.variantes[0] : undefined);
    const variantId = selectedVariant ? selectedVariant.id : `default-${product.id}`;
    const unitPrice = product.precio_base + (selectedVariant?.precio_adicional || 0);

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.variante_id === variantId);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].cantidad + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          cantidad: newQty,
          subtotal: Number((unitPrice * newQty).toFixed(2))
        };
        return updated;
      } else {
        const newItem: CartItem = {
          producto_id: product.id,
          variante_id: variantId,
          sku: selectedVariant?.sku || `SKU-${product.id}`,
          nombre_producto: product.nombre,
          nombre_variante: selectedVariant?.nombre_variante || 'Estándar',
          color_nombre: selectedVariant?.color_nombre || 'Único',
          color_hex: selectedVariant?.color_hex || '#2C2C2A',
          precio_unitario: Number(unitPrice.toFixed(2)),
          precio_base: product.precio_base,
          cantidad: quantity,
          subtotal: Number((unitPrice * quantity).toFixed(2)),
          imagen: selectedVariant?.imagen_variante || product.imagen_principal,
          stock_disponible: selectedVariant ? selectedVariant.stock : 10
        };
        return [...prev, newItem];
      }
    });

    setIsDrawerOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setItems(prev => prev.filter(i => i.variante_id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.variante_id === variantId) {
          const maxQty = item.stock_disponible > 0 ? Math.min(quantity, item.stock_disponible) : quantity;
          return {
            ...item,
            cantidad: maxQty,
            subtotal: Number((item.precio_unitario * maxQty).toFixed(2))
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    const sum = items.reduce((acc, item) => acc + item.subtotal, 0);
    return Number(sum.toFixed(2));
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (subtotal < appliedCoupon.compra_minima) return 0;

    if (appliedCoupon.tipo_descuento === 'porcentaje') {
      return Number(((subtotal * appliedCoupon.valor) / 100).toFixed(2));
    } else {
      return Number(Math.min(appliedCoupon.valor, subtotal).toFixed(2));
    }
  }, [appliedCoupon, subtotal]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15.00;
  }, [subtotal]);

  const total = useMemo(() => {
    return Number(Math.max(0, subtotal - discount + shipping).toFixed(2));
  }, [subtotal, discount, shipping]);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.cantidad, 0);
  }, [items]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));
  }, [subtotal]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (subtotal === 0) {
      return { success: false, message: 'Agrega productos a tu carrito antes de aplicar un cupón' };
    }

    try {
      const res = await couponService.validateCoupon(code, subtotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al validar cupón' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shipping,
        total,
        totalItems,
        isDrawerOpen,
        setIsDrawerOpen,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};
