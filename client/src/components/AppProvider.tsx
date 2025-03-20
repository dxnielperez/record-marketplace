// AppProvider.tsx
import { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { CartItemsProps, User, Product } from '../types/types';

export function AppProvider({ children }) {
  const [cartItems, setCartItems] = useState<CartItemsProps[]>([]);
  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem('token') || undefined
  );
  const [user, setUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : undefined;
  });

  useEffect(() => {
    async function loadCart() {
      if (!token) return;
      try {
        const res = await fetch(`/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setCartItems(result);
      } catch (error) {
        console.error(error);
      }
    }
    loadCart();
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      signIn(JSON.parse(storedUser), storedToken);
    }
  }, []);

  async function addToCart(product: Product) {
    if (!token) {
      alert('Sign in or make an account to purchase records!');
      return;
    }
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recordId: product?.recordId }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      setCartItems([...cartItems, result]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async function signIn(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token);
  }

  async function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(undefined);
    setToken(undefined);
  }

  async function removeFromCart(itemId: number) {
    try {
      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      const newCart = cartItems.filter(
        (item) => item.itemsId !== result.itemsId
      );
      setCartItems(newCart);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteListing(recordId: number) {
    try {
      const response = await fetch(`/api/delete-listing/${recordId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        if (response.status === 421) throw new Error('421');
        throw new Error('An error occurred');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCheckout() {
    try {
      const cartResponse = await fetch(`/api/cart/all/${user?.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await cartResponse.json();

      for (const cartItem of cartItems) {
        const recordResponse = await fetch(
          `/api/delete-record/${cartItem.recordId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!recordResponse.ok)
          console.error('An error occurred', recordResponse.status);
      }
      setCartItems([]);
    } catch (error) {
      console.error(error);
    }
  }

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    signIn,
    signOut,
    user,
    token,
    deleteListing,
    handleCheckout,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
