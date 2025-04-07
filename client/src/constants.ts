import { useContext } from 'react';
import { AppContext } from './components/AppContext';

export const API_URL = import.meta.env.VITE_API_URL || '';
// export const API_URL = 'http://localhost:8080';

export function useAdmin() {
  const { user } = useContext(AppContext);
  return user?.isAdmin ?? false;
}

export const GENRE_WHITELIST = [
  { genreId: 1, name: 'alternative' },
  { genreId: 2, name: 'country' },
  { genreId: 3, name: 'electronic' },
  { genreId: 4, name: 'jazz' },
  { genreId: 5, name: 'pop' },
  { genreId: 6, name: 'rap' },
  { genreId: 7, name: 'reggae' },
  { genreId: 8, name: 'r&b' },
  { genreId: 9, name: 'rock' },
  { genreId: 10, name: 'spanish' },
];
