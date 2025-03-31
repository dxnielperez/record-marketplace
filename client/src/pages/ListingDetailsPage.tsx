import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveListingDetails } from '../components/ActiveListingDetails';
import { useAdmin } from '../constants';

export function ListingDetailsPage() {
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
      <ActiveListingDetails />
    </>
  );
}
