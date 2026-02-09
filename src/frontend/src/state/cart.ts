import type { Product } from '../backend';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'marketplace_cart';

export function getStoredCart(): CartState {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return { items: [] };
}

export function saveCart(cart: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export function clearStoredCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from storage:', error);
  }
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + Number(item.product.price.value) * item.quantity;
  }, 0);
}

export function addToCart(cart: CartState, product: Product, quantity: number = 1): CartState {
  const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex >= 0) {
    const newItems = [...cart.items];
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: newItems[existingItemIndex].quantity + quantity,
    };
    return { items: newItems };
  }
  
  return {
    items: [...cart.items, { product, quantity }],
  };
}

export function removeFromCart(cart: CartState, productId: bigint): CartState {
  return {
    items: cart.items.filter(item => item.product.id !== productId),
  };
}

export function updateQuantity(cart: CartState, productId: bigint, quantity: number): CartState {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return {
    items: cart.items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ),
  };
}
