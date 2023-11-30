import { ActiveListingDetails } from '../components/ActiveListingDetails';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';

export function ListingDetailsPage() {
  return (
    <>
      <DashboardHeader />
      <ActiveListingDetails />
      <Footer />
    </>
  );
}
