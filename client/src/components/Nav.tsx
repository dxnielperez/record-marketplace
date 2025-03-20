import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import { handleSignOut } from './handleSignOut';

export default function Nav() {
  const { token } = useContext(AppContext);
  return (
    <nav className="bg-[#E1CE7A] p-2">
      <div className="w-full flex justify-between items-start">
        <Link to="/">
          <div className="relative group">
            <img
              className="mobile-logo relative object-cover max-w-[8rem] z-20"
              src="/spin-trade-red.png"
              alt="logo"
            />
            <img
              className="mobile-logo vinyl object-cover max-w-[7rem] absolute bottom-[-0.1rem] left-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[7rem] z-0 opacity-0 group-hover:opacity-100"
              src="/vinyl.webp"
              alt="vinyl record"
            />
          </div>
        </Link>

        <div className="flex flex-col justify-between h-[120px] items-end">
          <div className="flex gap-5">
            <Link
              to="/"
              className="bg-[#C84C09] text-white px-2 py-1 rounded-md">
              Sell Now
            </Link>
            <Link
              to="/sign-up"
              className="bg-[#C84C09] text-white px-2 py-1 rounded-md">
              Sign Up
            </Link>
            {token ? (
              <button onClick={handleSignOut}>Sign Out</button>
            ) : (
              <Link to="/login">Log In</Link>
            )}
          </div>
          <div className="flex gap-5 text-xl w-full">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop All</Link>
            <Link to="/">Shop Genre</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
