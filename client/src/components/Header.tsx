import { BsCart3 } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';
// import { IoSearchSharp } from 'react-icons/io5';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { handleSignOut } from './handleSignOut';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(
    !!localStorage.getItem('token')
  );

  const navigate = useNavigate();
  function handleSignOutClick() {
    handleSignOut(navigate);
    setIsUserSignedIn(false);
  }
  function handleUserIconClick(event) {
    event.preventDefault();
    if (isUserSignedIn) {
      alert('You are already signed in');
    } else {
      navigate('/login');
    }
  }
  function handleMenuClick() {
    setIsOpen(!isOpen);
  }
  function handleCloseMenu() {
    setIsOpen(false);
  }
  return (
    <div className="mobile-container">
      <div className="text-3xl w-full flex justify-end gap-x-3.5 absolute top-8 p-2 px-9 mobile-icons ">
        {isUserSignedIn && (
          <a
            onClick={handleSignOutClick}
            className="text-xl hover:text-slate-500 hover:underline cursor-pointer mobile-sign-out">
            Sign out
          </a>
        )}
        {/* <IoSearchSharp className="text-black hover:text-slate-500 duration-200" /> */}

        <Link to="/login">
          <FaRegUser
            onClick={handleUserIconClick}
            className="text-black hover:text-slate-500 duration-200"
          />
        </Link>

        <BsCart3 className="text-black hover:text-slate-500 duration-200" />
      </div>
      <nav className="nav-bg flex w-full gap-x-3.5 items-end p-3  mobile-nav">
        <div className="flex w-full">
          <div className="menu-btn hidden cursor-pointer">
            <IoMdMenu onClick={handleMenuClick} />
          </div>

          <Link to="/">
            <div className="relative group">
              <img
                className="mobile-logo relative object-cover max-w-[11rem] z-20"
                src="/SpinTrade7.png"
              />
              <img
                className="vinyl object-cover max-w-[10.8rem] absolute bottom-[-0.1rem] left-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[7rem] z-0 opacity-0 group-hover:opacity-100"
                src="/vinyl.webp"
              />
            </div>
          </Link>
          <div className="w-full flex justify-end items-center text-4xl logo-text sm:nav-bg mobile-font-size mobile-name relative left-[18%]">
            Spin - Trade
          </div>
        </div>
        <div className=" nav-links flex w-full gap-x-8 justify-end mobile">
          <Link
            className="text-black hover:text-slate-500 hover:underline duration-200"
            to="/">
            Home
          </Link>
          <Link
            to="/ProductPage"
            className="text-black hover:text-slate-500 hover:underline duration-200">
            Shop All
          </Link>
          <a className="text-black hover:text-slate-500 hover:underline duration-200">
            Shop by Genre
          </a>

          {isUserSignedIn && (
            <Link
              className="text-black hover:text-slate-500 hover:underline duration-200"
              to="/CreateListing">
              Create Listing
            </Link>
          )}
        </div>
      </nav>
      <MenuModal isOpen={isOpen} onClose={handleCloseMenu} />
    </div>
  );
}

function MenuModal({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-start transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}></div>
      <div className="bg-[white]/[0.85] p-4 w-2/4 h-full fixed left-0">
        <IoMdClose
          className="text-3xl mb-14 justify-center"
          onClick={onClose}
        />
        <div className="h-full flex flex-col gap-3">
          <Link to="/" className="underline text-xl">
            Home
          </Link>
          <Link to="/ProductPage" className="underline text-xl">
            Shop All
          </Link>
          <p className="underline text-xl">Shop by Genre</p>
          <Link to="/CreateListing" className="underline text-xl">
            Create Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
