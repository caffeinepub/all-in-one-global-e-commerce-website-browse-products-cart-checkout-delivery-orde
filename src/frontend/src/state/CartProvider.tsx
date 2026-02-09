import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../backend';
import {
  CartState,
  CartItem,
  getStoredCart,
  saveCart,
  clearStoredCart,
  calculateSubtotal,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateQuantity as updateQuantityUtil,
} from './cart';

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => getStoredCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => addToCartUtil(prevCart, product, quantity));
  };

  const removeFromCart = (productId: bigint) => {
    setCart(prevCart => removeFromCartUtil(prevCart, productId));
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    setCart(prevCart => updateQuantityUtil(prevCart, productId, quantity));
  };

  const clearCart = () => {
    setCart({ items: [] });
    clearStoredCart();
  };

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = calculateSubtotal(cart.items);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
