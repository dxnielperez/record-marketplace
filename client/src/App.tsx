// import { useEffect } from 'react';
import './App.css';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import { ProductPage } from './pages/ProductPage';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="CreateAccount" element={<CreateAccountPage />} />
        <Route path="CreateListing" element={<CreateListingPage />} />
        <Route path="ProductPage" element={<ProductPage />} />
      </Routes>
    </div>
  );
}
