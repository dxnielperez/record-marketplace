import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import { handleSignOut } from './handleSignOut';
import { Genre } from '../types/types';
import { RiAccountCircleFill } from 'react-icons/ri';
import { IoCart } from 'react-icons/io5';

export default function Nav() {
  const { token, user } = useContext(AppContext);
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
  console.log('user', user);

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
            <Link to="account" className="text-3xl">
              <RiAccountCircleFill />
            </Link>
            <Link to={token ? '/cart' : '/login'} className="text-3xl">
              <IoCart />
            </Link>
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
            <button onClick={handleSignOut}>Sign Out</button>
            <Link to="/login">Log In</Link>
          </div>
          <div className="flex gap-5 text-xl">
            <Link to="/">Home</Link>
            <Link to="/">Shop All</Link>
            <div className="dropdown">
              <a className="text-black cursor-pointer hover:underline duration-200">
                Shop by Genre
              </a>
              <div className="dropdown-content">
                {genres.map((genre) => (
                  <Link key={genre.genreId} to={`/genre/${genre.genreId}`}>
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
