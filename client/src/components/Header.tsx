import { BsCart3 } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { AppContext } from './AppContext';
import { Genre } from '../types/types';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const { signOut, token, cartItems } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getGenres() {
      try {
        const res = await fetch('/api/get-genre-ids');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setGenres(result);
      } catch (error) {
        console.error(error);
      }
    }
    getGenres();
  }, []);

  function signOutClick() {
    signOut();
    navigate('/');
  }

  function handleUserIconClick(event) {
    event.preventDefault();
    if (token) {
      navigate('/SellerDashboard');
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
  const itemsAmount = cartItems.length === 0 ? '' : cartItems.length;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1086);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1086);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="mobile-container">
      <h3 className="bg-[#5C6770] text-white flex justify-center items-center h-[2rem] mobile-home-page">
        FREE shipping on orders over $90* 🔥
      </h3>
      <div className="text-3xl w-full flex justify-end gap-x-3.5 absolute top-8 p-2 px-9 mobile-icons ">
        {token && (
          <a
            onClick={signOutClick}
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

        <Link to={token ? '/ShoppingCart' : '/login'}>
          <p className={itemsAmount ? 'item-bubble' : ''}>{itemsAmount}</p>
          <BsCart3 className="text-black hover:text-slate-500 duration-200" />
        </Link>
      </div>
      <nav className="nav-bg flex w-full gap-x-3.5 items-end p-3  mobile-nav">
        <div className="flex w-full">
          <div className="menu-btn hidden cursor-pointer">
            {isMobile && (
              <>
                <IoMdMenu
                  onClick={handleMenuClick}
                  className="absolute top-[5rem]"
                />
                <Link
                  to="/"
                  className="w-full flex justify-end items-center text-4xl logo-text sm:nav-bg mobile-font-size mobile-name relative left-[8rem] cursor-pointer">
                  Spin - Trade
                </Link>
              </>
            )}
          </div>

          <Link to="/">
            <div className="relative group">
              <img
                className="mobile-logo relative object-cover max-w-[11rem] z-20"
                src="/SpinTrade7.png"
              />
              <img
                className="mobile-logo vinyl object-cover max-w-[10.8rem] absolute bottom-[-0.1rem] left-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[7rem] z-0 opacity-0 group-hover:opacity-100"
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

          <div className="dropdown">
            <a className="text-black hover:text-slate-500 hover:underline duration-200">
              Shop by Genre
            </a>
            <div className="dropdown-content">
              {genres.map((genre) => (
                <Link
                  key={genre.genreId}
                  to={`/GenreCatalogPage/${genre.genreId}`}>
                  {genre.name}
                </Link>
              ))}
              {/* <Link to="/GenreCatalogPage/1">Reggae</Link>
              <Link to="/GenreCatalogPage/2">Rap</Link>
              <Link to="/GenreCatalogPage/3">Alternative</Link>
              <Link to="/GenreCatalogPage/4">Jazz</Link>
              <Link to="/GenreCatalogPage/5">Electronic</Link> */}
            </div>
          </div>

          {token && (
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
  const token = localStorage.getItem('token');
  const [genres, setGenres] = useState<Genre[]>([]);
  useEffect(() => {
    async function getGenres() {
      try {
        const res = await fetch('/api/get-genre-ids');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setGenres(result);
      } catch (error) {
        console.error(error);
      }
    }
    getGenres();
  }, []);
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
          <div className="dropdown">
            <a className="text-black hover:text-slate-500 hover:underline duration-200 underline text-xl">
              Shop by Genre
            </a>
            <div className="dropdown-content">
              {genres.map((genre) => (
                <Link
                  key={genre.genreId}
                  onClick={onClose}
                  className="underline text-xl"
                  to={`/GenreCatalogPage/${genre.genreId}`}>
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
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
