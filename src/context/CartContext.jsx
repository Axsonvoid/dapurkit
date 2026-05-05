import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from storage on startup
  useEffect(() => {
    const saved = localStorage.getItem('dapurkit_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('dapurkit_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (meal) => {
    const existing = cart.find(item => item.id === meal.id);
    if (existing) {
      setCart(cart.map(item => item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...meal, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);