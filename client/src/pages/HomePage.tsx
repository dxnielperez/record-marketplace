import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function HomePage() {
  return (
    <>
      <Header />
      <h3 className="bg-[grey] text-white flex justify-center  items-center h-[2.5rem]">
        Your new favorite place to buy and sell vinyl records !
      </h3>
      <img className="mobile-home max-w-screen" src="/HomePageImg.jpg" />
      <Footer />
      <Outlet />
    </>
  );
}
