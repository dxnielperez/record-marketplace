import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function HomePage() {
  return (
    <>
      <Header />
      <img className="mt-3 mobile-home" src="/HomePageImg.jpg" />
      <Footer />
      <Outlet />
    </>
  );
}
