import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('perfume-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const DISCOUNT_RATE = 0.20;
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 15;

  useEffect(() => {
    try {
      localStorage.setItem('perfume-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // ✅ بدون أي Toast - الكومبوننت هو اللي يعرض Toast
  const addToCart = (product, selectedSize, quantity = 1) => {
    if (!selectedSize) {
      return { success: false, message: 'Please select a size' };
    }

    if (!selectedSize.isAvailable || selectedSize.stock < quantity) {
      return { success: false, message: 'This size is out of stock' };
    }

    let message = '';
    
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.product._id === product._id && 
          item.size._id === selectedSize._id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

        if (newQuantity > selectedSize.stock) {
          message = `Only ${selectedSize.stock} items available in stock`;
          return prevItems;
        }

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
        };

        message = 'Cart updated!';
        return updatedItems;
      } else {
        const newItem = {
          _id: `${product._id}-${selectedSize._id}`,
          product: {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            images: product.images,
          },
          size: {
            _id: selectedSize._id,
            size: selectedSize.size,
            unit: selectedSize.unit || 'ml',
            price: selectedSize.price,
            stock: selectedSize.stock,
            isAvailable: selectedSize.isAvailable,
          },
          quantity,
        };

        message = 'Added to cart!';
        return [...prevItems, newItem];
      }
    });

    return { success: true, message };
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item._id !== itemId);
    });
    return { success: true, message: 'Removed from cart' };
  };

  const updateQuantity = (itemId, delta) => {
    let result = { success: false, message: '' };
    
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item._id === itemId) {
          const newQuantity = item.quantity + delta;

          if (newQuantity < 1) {
            return item;
          }

          if (newQuantity > item.size.stock) {
            result = { success: false, message: `Only ${item.size.stock} items available` };
            return item;
          }

          result = { success: true, message: 'Quantity updated' };
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });

    return result;
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('perfume-cart');
    return { success: true, message: 'Cart cleared' };
  };

  const isInCart = (productId, sizeId) => {
    return cartItems.some(
      (item) => item.product._id === productId && item.size._id === sizeId
    );
  };

  const getCartItem = (productId, sizeId) => {
    return cartItems.find(
      (item) => item.product._id === productId && item.size._id === sizeId
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.size.price * item.quantity,
    0
  );

  const discount = subtotal * DISCOUNT_RATE;
  const subtotalAfterDiscount = subtotal - discount;
  const shipping = subtotalAfterDiscount > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotalAfterDiscount + shipping;
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalSavings = discount;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
    subtotal,
    discount,
    subtotalAfterDiscount,
    shipping,
    total,
    cartCount,
    totalSavings,
    discountRate: DISCOUNT_RATE,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};