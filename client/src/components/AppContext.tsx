import { createContext } from 'react';
import { CartItemsProps, Product, User } from '../types/types';

type AppContextValues = {
  cartItems: CartItemsProps[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemsId: number) => Promise<void>;
  user: User | undefined;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  token: string | undefined;
  deleteListing: (recordId: number) => Promise<void>;
  handleCheckout: () => Promise<void>;
};

export const AppContext = createContext<AppContextValues>({
  cartItems: [],
  addToCart: async () => undefined,
  removeFromCart: async () => undefined,
  user: undefined,
  signIn: () => undefined,
  signOut: () => undefined,
  token: undefined,
  deleteListing: async () => undefined,
  handleCheckout: async () => undefined,
});
