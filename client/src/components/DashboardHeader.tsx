import { FaRegUser } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { AppContext } from './AppContext';

export function DashboardHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, token } = useContext(AppContext);

  const navigate = useNavigate();

  function signOutClick() {
    signOut();
    navigate('/');
  }

  function handleUserIconClick(event) {
    event.preventDefault();
    alert('You are already on your seller dashboard');
  }

  function handleMenuClick() {
    setIsOpen(!isOpen);
  }

  function handleCloseMenu() {
    setIsOpen(false);
  }

  const isMobile = window.innerWidth <= 768;
  return (
    <>
      <div className="mobile-container">
        <h3 className="bg-[#5C6770] text-white flex justify-center items-center h-[2rem] mobile-home-page">
          First 5 items sold have no seller fees! 🔥
        </h3>
        <div className="text-3xl w-full flex justify-end gap-x-3.5 absolute top-8 p-2 px-9 mobile-icons ">
          {token && (
            <a
              onClick={signOutClick}
              className="text-xl hover:text-slate-500 hover:underline cursor-pointer mobile-sign-out .mobile-seller-signout">
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
        </div>
        <nav className="nav-bg flex w-full gap-x-3.5 items-end p-3  mobile-nav">
          <div className="flex w-full">
            <div className="menu-btn hidden cursor-pointer">
              {isMobile && (
                <>
                  <IoMdMenu
                    onClick={handleMenuClick}
                    className="dashboard-menu"
                  />
                  <Link
                    to="/"
                    className="w-full flex justify-end items-center text-4xl logo-text sm:nav-bg mobile-font-size mobile-name relative left-[18%] cursor-pointer seller-logo">
                    Spin - Trade
                  </Link>
                </>
              )}
            </div>

            <Link to="/">
              <div className="relative group">
                <img
                  className="mobile-logo relative object-cover max-w-[11rem] z-1"
                  src="/SpinTrade7.png"
                />
                <img
                  className="mobile-logo vinyl object-cover max-w-[10.8rem] absolute bottom-[-0.1rem] left-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[7rem] z-11 opacity-0 group-hover:opacity-100"
                  src="/vinyl.webp"
                />
              </div>
            </Link>
            {!isMobile && (
              <Link
                to="/"
                className="w-full flex justify-end items-center text-4xl logo-text sm:nav-bg mobile-font-size mobile-name relative left-[18%]">
                Spin - Trade
              </Link>
            )}
          </div>
          <div className=" nav-links flex w-full gap-x-8 justify-end mobile ">
            <Link
              className="text-black hover:text-slate-500 hover:underline duration-200"
              to="/">
              Home
            </Link>

            {token && (
              <Link
                className="text-black hover:text-slate-500 hover:underline duration-200"
                to="/CreateListing">
                Create Listing
              </Link>
            )}
            <p className="text-black hover:text-slate-500 hover:underline duration-200">
              Active Listings
            </p>
            <p className="text-black hover:text-slate-500 hover:underline duration-200">
              Sold Listings
            </p>
          </div>
        </nav>
        <MenuModal isOpen={isOpen} onClose={handleCloseMenu} />
        <h3 className="text-4xl flex justify-center pb-[2rem] pt-[1rem] bg-[ghostwhite]">
          Seller Dashboard
        </h3>
      </div>
    </>
  );
}

function MenuModal({ isOpen, onClose }) {
  const token = localStorage.getItem('token');
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

          {token && (
            <Link to="/CreateListing" className="underline text-xl">
              Create Listing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
