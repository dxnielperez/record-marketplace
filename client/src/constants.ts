import { useContext } from 'react';
import { AppContext } from './components/AppContext';

export const API_URL = import.meta.env.VITE_API_URL || '';
// export const API_URL = 'http://localhost:8080';

export function useAdmin() {
  const { user } = useContext(AppContext);
  return user?.isAdmin ?? false;
}
