import { BsCart3 } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
export function Header() {
  return (
    <div className="mt-2.5 mobile-container">
      <div className="text-2xl w-full flex justify-end gap-x-3.5 nav-bg p-2 mobile-icons">
        <IoSearchSharp className="text-black hover:text-slate-500 duration-200" />
        <Link to="/login">
          <FaRegUser className="text-black hover:text-slate-500 duration-200" />
        </Link>
        <BsCart3 className="text-black hover:text-slate-500 duration-200" />
      </div>
      <nav className="nav-bg flex w-full gap-x-3.5 items-end p-3">
        <div className="flex w-full">
          <img className="w-1/4 mobile-logo" src="/Group3.png" />
          <div className="flex-col flex justify-center ml-5 text-4xl logo-text sm:nav-bg mobile-font-size">
            Roots Record <br></br>Marketplace
          </div>
        </div>
        <div className=" nav-links flex w-full gap-x-8 justify-end mobile">
          <Link
            className="text-black hover:text-slate-500 hover:underline duration-200"
            to="/">
            Home
          </Link>
          <a className="text-black hover:text-slate-500 hover:underline duration-200">
            Shop All
          </a>
          <a className="text-black hover:text-slate-500 hover:underline duration-200">
            Shop by Genre
          </a>
          <a className="text-black hover:text-slate-500 hover:underline duration-200">
            Create Listing
          </a>
        </div>
        <div className="menu-btn hidden">
          <IoMdMenu />
        </div>
      </nav>
    </div>
  );
}
