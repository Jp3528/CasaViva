import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('casaviva_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('casaviva_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (productId: string): boolean => {
    let isAdded = false;
    setWishlistIds(prev => {
      if (prev.includes(productId)) {
        isAdded = false;
        return prev.filter(id => id !== productId);
      } else {
        isAdded = true;
        return [...prev, productId];
      }
    });
    return isAdded;
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe ser utilizado dentro de un WishlistProvider');
  }
  return context;
};
