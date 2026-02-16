import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('perfume-wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('perfume-wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item._id === product._id);
      if (exists) {
        return prevItems;
      }

      const newItem = {
        _id: product._id,
        name: product.name,
        brand: product.brand,
        images: product.images,
        sizes: product.sizes,
        gender: product.gender,
        category: product.category,
        priceRange: product.priceRange,
      };

      return [...prevItems, newItem];
    });

    return { success: true, message: 'Added to wishlist!' };
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => {
      return prevItems.filter((item) => item._id !== productId);
    });

    return { success: true, message: 'Removed from wishlist' };
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('perfume-wishlist');
    return { success: true, message: 'Wishlist cleared' };
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const toggleWishlist = (product) => {
    const inWishlist = isInWishlist(product._id);
    
    if (inWishlist) {
      return removeFromWishlist(product._id);
    } else {
      return addToWishlist(product);
    }
  };

  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};