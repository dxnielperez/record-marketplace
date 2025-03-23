import { useEffect } from 'react';
// import { CreateNewListing } from '../components/CreateNewListing';
import { useNavigate } from 'react-router-dom';
import { NewListingForm } from '../components/NewListingForm';

export function CreateListingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div>
      <NewListingForm />
    </div>
  );
}
