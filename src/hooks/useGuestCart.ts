"use client";

import { useState, useEffect } from "react";

const CART_STORAGE_KEY = "guestCart";
const CART_UPDATE_EVENT = "guestCartUpdate";

export interface GuestCartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

export function useGuestCart() {
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load cart from localStorage on mount
    const loadCart = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setGuestCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error loading guest cart:", error);
        }
      }
      setIsLoaded(true);
    };

    loadCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setGuestCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error loading guest cart:", error);
        }
      } else {
        setGuestCart([]);
      }
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    
    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    };
  }, []);

  // Helper to save and notify
  const saveAndNotify = (newCart: GuestCartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    setGuestCart(newCart);
    // Notify all other useGuestCart instances
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
  };

  const addToCart = (productId: string) => {
    const existingItem = guestCart.find((item) => item.productId === productId);
    let newCart: GuestCartItem[];
    
    if (existingItem) {
      newCart = guestCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...guestCart, { productId, quantity: 1, addedAt: Date.now() }];
    }
    
    saveAndNotify(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = guestCart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    saveAndNotify(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = guestCart.filter((item) => item.productId !== productId);
    saveAndNotify(newCart);
  };

  const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setGuestCart([]);
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
  };

  return {
    guestCart,
    isLoaded,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
