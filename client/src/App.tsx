// App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { SignUp } from './pages/SignUp';
import { CreateListingPage } from './pages/CreateListingPage';
import { Shop } from './pages/Shop';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ShoppingCartPage } from './pages/ShoppingCartPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { ListingDetailsPage } from './pages/ListingDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { GenreCatalogPage } from './pages/GenreCatalogPage';
import { AppProvider } from './components/AppProvider';
import About from './pages/About';

export default function App() {
  return (
    <AppProvider>
      <div className="w-full max-w-[2000px] min-w-[330px] mx-auto px-4 bg-snow">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="create" element={<CreateListingPage />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products/:recordId" element={<ProductDetailsPage />} />
          <Route path="cart" element={<ShoppingCartPage />} />
          <Route path="account" element={<SellerDashboard />} />
          <Route
            path="account/record/:recordId"
            element={<ListingDetailsPage />}
          />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="confirmation" element={<OrderConfirmationPage />} />
          <Route path="shop/:genreName" element={<GenreCatalogPage />} />
        </Routes>
        <Footer />
      </div>
    </AppProvider>
  );
}
