import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto, cantidad = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.producto.id === producto.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prevCart, { producto, cantidad }];
    });
  };

  const removeFromCart = (productoId) => {
    setCart(prevCart => prevCart.filter(item => item.producto.id !== productoId));
  };

  const updateQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
