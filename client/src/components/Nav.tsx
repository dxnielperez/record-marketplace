import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { IoCart, IoMenuSharp, IoPersonCircleSharp } from 'react-icons/io5';
import { useAdmin } from '../constants';

export default function Nav() {
  const { user, signOut, cartItems } = useContext(AppContext);
  const navigate = useNavigate();
  const itemsAmount = cartItems.length === 0 ? '' : cartItems.length;
  const isAdmin = useAdmin();

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
          {isAdmin && (
            <Link
              className="w-min whitespace-nowrap text-center px-4 py-1 border-1 border border-black rounded-md hover:text-snow bg-emerald"
              to={`${user ? '/create' : '/login'}`}>
              Sell Now
            </Link>
          )}

          {isAdmin ? (
            <div className="dropdown">
              <Link to="/account">
                <IoPersonCircleSharp size={30} />
              </Link>
              <div className="dropdown-content right-[-2px]">
                <Link to="/account">Account</Link>
                {user && (
                  <button
                    onClick={handleSignOutClick}
                    className="text-start w-full px-4 py-2 text-black hover:bg-[#dae0e7] cursor-pointer rounded-md">
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="dropdown">
                {user ? (
                  <span className="text-black cursor-pointer">
                    <IoPersonCircleSharp size={30} />
                  </span>
                ) : (
                  <Link to="/login" className="text-black cursor-pointer">
                    <IoPersonCircleSharp size={30} />
                  </Link>
                )}

                <div className="dropdown-content right-[-2px]  cursor-pointer">
                  {!user && (
                    <Link to="/login" className="text-black cursor-pointer">
                      Log In
                    </Link>
                  )}
                  {user && (
                    <button
                      onClick={handleSignOutClick}
                      className="text-start w-full px-4 py-2 text-black hover:bg-[#dae0e7] cursor-pointer rounded-md">
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

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
  const navigate = useNavigate();
  const isAdmin = useAdmin();

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
            className="text-2xl font-bold italic whitespace-nowrap tracking-tighter leading-none"
            to="/">
            RIPPLE RECORDS
          </Link>
        </div>

        <div className="flex gap-2 items-center">
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
          <hr className="border-t border-black/20" />
          {isAdmin && <Link to="/account">Account</Link>}
          {/* <button
            onClick={() => {
              handleMenuClick();
              navigate('account');
            }}>
            Account{' '}
          </button> */}
          {user ? (
            <button onClick={onSignOut} className="pr-2 text-start">
              Sign Out
            </button>
          ) : (
            <button
              className="text-start"
              onClick={() => {
                handleMenuClick();
                navigate('login');
              }}>
              Log In
            </button>
          )}
        </div>
      )}
      {showMenu && <hr className="border-t border-black mt-4" />}
    </div>
  );
};
