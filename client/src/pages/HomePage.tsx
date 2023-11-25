import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { SideScrollCarousel } from '../components/Carousel';

export function HomePage() {
  const isMobile = window.innerWidth <= 768;
  return (
    <>
      <h3 className="bg-[#DCADA8] text-white flex justify-center items-center h-[2rem] mobile-home-page">
        FREE shipping on orders over $90* 🔥
      </h3>
      <Header />
      {!isMobile ? (
        <img src="/landing4.png" className="w-full" />
      ) : (
        <img src="/mobilelanding.png" className="w-full" />
      )}
      <SideScrollCarousel />
      <Footer />
      <Outlet />
    </>
  );
}
