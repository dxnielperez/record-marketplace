import { ActiveListings } from '../components/ActiveListings';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';

export function SellerDashboard() {
  return (
    <>
      <DashboardHeader />
      <ActiveListings />
      <Footer />
    </>
  );
}
