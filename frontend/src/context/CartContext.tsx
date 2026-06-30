'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

export interface CartItem {
  id: string; 
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const res = await apiFetch('/cart');
          if (res.ok) {
            const data = await res.json();
            setCartItems(data);
          }
        } catch (err) {
          console.error('Error loading cart from database', err);
        }
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };

    loadCart();
  }, [user]);

  const saveLocalCart = (items: CartItem[]) => {
    setCartItems(items);
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    if (user) {
      try {
        const res = await apiFetch('/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity })
        });
        if (res.ok) {
          const cartRes = await apiFetch('/cart');
          if (cartRes.ok) {
            const data = await cartRes.json();
            setCartItems(data);
          }
        }
      } catch (err) {
        console.error('Error adding to cart on DB', err);
      }
    } else {
      const existingIndex = cartItems.findIndex(item => item.productId === product.id);
      let newItems = [...cartItems];

      if (existingIndex > -1) {
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems.push({
          id: product.id,
          productId: product.id,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            images: product.images,
            stock: product.stock
          }
        });
      }
      saveLocalCart(newItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (user) {
      try {
        const item = cartItems.find(i => i.productId === productId);
        if (item) {
          const res = await apiFetch(`/cart/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
          });
          if (res.ok) {
            setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
          }
        }
      } catch (err) {
        console.error('Error updating cart item quantity', err);
      }
    } else {
      const newItems = cartItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      saveLocalCart(newItems);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const item = cartItems.find(i => i.productId === productId);
        if (item) {
          const res = await apiFetch(`/cart/${item.id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            setCartItems(prev => prev.filter(i => i.productId !== productId));
          }
        }
      } catch (err) {
        console.error('Error removing from cart on DB', err);
      }
    } else {
      const newItems = cartItems.filter(item => item.productId !== productId);
      saveLocalCart(newItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!user) {
      localStorage.removeItem('cart');
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
