import { createContext } from 'react';
import { CartItemsProps, Product, User } from '../types/types';

type AppContextValues = {
  cartItems: CartItemsProps[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: () => Promise<void>;
  user: User | undefined;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  token: string | undefined;
};

export const AppContext = createContext<AppContextValues>({
  cartItems: [],
  addToCart: async () => undefined,
  removeFromCart: async () => undefined,
  user: undefined,
  signIn: () => undefined,
  signOut: () => undefined,
  token: undefined,
});
