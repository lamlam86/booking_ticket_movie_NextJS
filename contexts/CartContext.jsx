"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lmk_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Filter out expired showtimes
        const now = new Date();
        const validItems = parsed.filter(item => new Date(item.showtime.start_time) > now);
        setCart(validItems);
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lmk_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    // Add type if not present (default to 'ticket' for backward compatibility)
    const itemWithType = { ...item, type: item.type || 'ticket', id: item.id || Date.now() };
    
    // For tickets, check if same showtime already in cart
    if (itemWithType.type === 'ticket') {
      const existing = cart.find(
        c => c.type === 'ticket' && c.showtime?.id === item.showtime?.id
      );
      
      if (existing) {
        // Update existing item
        setCart(cart.map(c => 
          c.type === 'ticket' && c.showtime?.id === item.showtime?.id ? itemWithType : c
        ));
        setIsOpen(true);
        return;
      }
    }
    
    // For other types or new items, just add
    setCart([...cart, itemWithType]);
    setIsOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateCartItem = (itemId, updates) => {
    setCart(cart.map(c => 
      c.id === itemId ? { ...c, ...updates } : c
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'ticket') {
        // Movie tickets - use seatData prices if available
        const ticketTotal = item.seatData 
          ? item.seatData.reduce((sum, s) => sum + (s.price || 65000), 0)
          : (item.seats?.length || 0) * (item.showtime?.base_price || 65000);
        const concessionTotal = Object.entries(item.concessions || {}).reduce((sum, [id, qty]) => {
          const concession = item.concessionItems?.find(c => c.id === Number(id));
          return sum + (concession ? concession.price * qty : 0);
        }, 0);
        return total + ticketTotal + concessionTotal;
      } else if (item.type === 'concession') {
        // Standalone concessions (bắp nước)
        return total + (item.total || 0);
      } else if (item.type === 'event' || item.type === 'service') {
        // Events and services
        return total + (item.price || 0);
      }
      return total;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => {
      if (item.type === 'ticket') {
        return count + (item.seats?.length || 0);
      } else if (item.type === 'concession') {
        return count + (item.totalItems || 0);
      } else {
        return count + 1; // Each event/service counts as 1
      }
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      setIsOpen,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      getCartTotal,
      getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

