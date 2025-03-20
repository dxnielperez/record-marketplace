import { ActiveListings } from '../components/ActiveListings';
import { DashboardHeader } from '../components/DashboardHeader';

export function SellerDashboard() {
  return (
    <>
      <DashboardHeader />
      <ActiveListings />
    </>
  );
}
