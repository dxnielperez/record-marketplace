import { useEffect } from 'react';
// import { CreateNewListing } from '../components/CreateNewListing';
import { useNavigate } from 'react-router-dom';
import { NewListingForm } from '../components/NewListingForm';
import { useAdmin } from '../constants';

export function CreateListingPage() {
  const navigate = useNavigate();
  const isAdmin = useAdmin();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  return (
    <div>
      <NewListingForm />
    </div>
  );
}
