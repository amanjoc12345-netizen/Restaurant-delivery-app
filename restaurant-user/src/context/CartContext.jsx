import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showToast } = useToast();

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart items:', error);
      }
    }
  }, []);

  // Save cart to LocalStorage when it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('restaurant_cart', JSON.stringify(items));
  };

  const addToCart = (item, quantity = 1) => {
    const existingItemIdx = cartItems.findIndex((i) => i.id === item.id);
    let updatedCart = [...cartItems];

    if (existingItemIdx > -1) {
      updatedCart[existingItemIdx].quantity += quantity;
    } else {
      updatedCart.push({ ...item, quantity });
    }

    saveCart(updatedCart);
    showToast(`Added ${item.name} to cart!`, 'success');
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    const updatedCart = cartItems.filter((i) => i.id !== itemId);
    saveCart(updatedCart);
    if (item) {
      showToast(`Removed ${item.name} from cart.`, 'info');
    }
  };

  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updatedCart);
  };

  const decreaseQuantity = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(itemId);
    } else {
      const updatedCart = cartItems.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
      saveCart(updatedCart);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
