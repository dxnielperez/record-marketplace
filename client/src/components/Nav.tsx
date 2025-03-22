import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
// import { Genre } from '../types/types';
import { IoCart, IoMenuSharp, IoPersonCircleSharp } from 'react-icons/io5';

export default function Nav() {
  const { user, signOut, cartItems } = useContext(AppContext);
  const navigate = useNavigate();
  const itemsAmount = cartItems.length === 0 ? '' : cartItems.length;

  // const [genres, setGenres] = useState<Genre[]>([]);
  // useEffect(() => {
  //   async function getGenres() {
  //     try {
  //       const res = await fetch('/api/get-genre-ids');
  //       if (!res.ok) throw new Error(`Error: ${res.status}`);
  //       const result = await res.json();
  //       setGenres(result);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getGenres();
  // }, []);

  const handleSignOutClick = () => {
    signOut();
    alert('Signed out!');
    navigate('/');
  };

  return (
    <div className="w-full py-4">
      <nav className="w-full justify-between items-end hidden lg:flex">
        <div className="flex gap-10 items-end">
          <Link to="/" className="relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link to="/about" className="relative group">
            About{' '}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link to="/shop" className="relative group">
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <Link
          to="/"
          className="flex items-end text-xl font-bold italic tracking-tighter whitespace-nowrap leading-none lg:text-large">
          RIPPLE RECORDS
        </Link>

        <div className="flex gap-2 items-end">
          {user && (
            <button
              onClick={handleSignOutClick}
              className="mr-2 relative group">
              Sign Out
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </button>
          )}

          <Link
            className="bg-emerald text-snow px-3 rounded-md h-min py-1 drop-shadow-lg"
            to={`${user ? '/create' : '/login'}`}>
            Sell Now
          </Link>
          <Link to={`${user ? '/account' : '/login'}`}>
            <IoPersonCircleSharp size={30} />
          </Link>
          <Link to="/cart" className="flex gap-2">
            <IoCart size={30} />
            <span className="text-xl mt-auto">{itemsAmount}</span>
          </Link>
        </div>
      </nav>

      <MobileNav
        user={user}
        cartItems={itemsAmount}
        onSignOut={handleSignOutClick}
      />
    </div>
  );
}

const MobileNav = ({ user, onSignOut, cartItems }) => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  function handleMenuClick() {
    setShowMenu((prev) => !prev);
  }

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  return (
    <div className="w-full">
      <nav className="flex lg:hidden w-full justify-between items-end">
        <div>
          <Link
            className="text-3xl font-bold italic whitespace-nowrap tracking-tighter leading-none"
            to="/">
            RIPPLE RECORDS
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          <Link to={`${user ? '/account' : '/login'}`}>
            <IoPersonCircleSharp size={30} />
          </Link>
          <Link to="/cart" className="flex gap-2">
            <IoCart size={30} />
            <span className="text-xl mt-auto">{cartItems}</span>
          </Link>
          <button onClick={handleMenuClick}>
            <IoMenuSharp size={30} />
          </button>
        </div>
      </nav>
      <hr className="border-t border-black mt-4" />
      {showMenu && (
        <div className="flex flex-col gap-4 mt-2">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/shop">Shop</Link>

          <Link
            className="bg-emerald px-4 py-1 rounded-md h-min w-min mx-auto whitespace-nowrap"
            to={`${user ? '/create' : '/login'}`}>
            Sell Now
          </Link>
          {user && (
            <button onClick={onSignOut} className="pr-2">
              Sign Out
            </button>
          )}
        </div>
      )}
      {showMenu && <hr className="border-t border-black mt-4" />}
    </div>
  );
};
