import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { OrderConfirmation } from '../components/OrderConfirmation';

export function OrderConfirmationPage() {
  return (
    <div>
      <Header />
      <OrderConfirmation />
      <Footer />
    </div>
  );
}
