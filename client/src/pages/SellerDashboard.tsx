import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveListings } from '../components/ActiveListings';
import { useAdmin } from '../constants';

export function SellerDashboard() {
  const navigate = useNavigate();
  const isAdmin = useAdmin();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  return (
    <>
      <ActiveListings />
    </>
  );
}
