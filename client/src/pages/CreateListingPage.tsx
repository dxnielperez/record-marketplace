import { CreateNewListing } from '../components/CreateNewListing';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function CreateListingPage() {
  return (
    <div>
      <Header />
      <CreateNewListing />
      <Footer />
    </div>
  );
}
