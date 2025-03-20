import { Outlet } from 'react-router-dom';
import { SideScrollCarousel } from '../components/Carousel';

export function Home() {
  const isMobile = window.innerWidth <= 768;
  return (
    <>
      {!isMobile ? (
        <img src="/landingpage1.png" className="w-full" alt="" />
      ) : (
        <img src="/mobilelanding2.png" className="w-full" alt="" />
      )}
      <SideScrollCarousel />
      <Outlet />
    </>
  );
}
