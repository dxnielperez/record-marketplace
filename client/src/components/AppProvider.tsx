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

  // Define the API base URL based on environment
  const apiUrl =
    import.meta.env.VITE_API_URL || 'https://record-marketplace.onrender.com';

  useEffect(() => {
    async function loadCart() {
      if (!token) {
        setCartItems([]);
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setCartItems(result);
      } catch (error) {
        console.error(error);
        setCartItems([]);
      }
    }
    loadCart();
  }, [apiUrl, token]);

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
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recordId: product?.recordId }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error adding to cart: ${response.status} - ${errorText}`
        );
      }
      const result = await response.json();
      setCartItems([...cartItems, result]);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
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
    setCartItems([]);
  }

  async function removeFromCart(itemId: number) {
    try {
      const response = await fetch(`${apiUrl}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
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
      const response = await fetch(`${apiUrl}/api/delete-record/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete listing: ${response.status} - ${errorText}`
        );
      }
      const result = await response.json();
      if (!result) {
        throw new Error('No record deleted');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  async function handleCheckout() {
    try {
      const response = await fetch(`${apiUrl}/api/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Checkout failed: ${response.status} - ${errorText}`);
      }
      setCartItems([]);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }

  const contextValue = {
    cartItems,
    setCartItems,
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
