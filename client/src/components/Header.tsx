import { TiShoppingCart } from 'react-icons/ti';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import { IoMdMenu } from 'react-icons/io';
export function Header() {
  return (
    <div className="mt-2.5 mobile-container">
      <div className="text-2xl w-full   flex justify-end gap-x-3.5 nav-bg p-2 mobile-icons">
        <IoSearchSharp />
        <FaRegUser />
        <MdOutlineFavoriteBorder />
        <TiShoppingCart />
      </div>
      <nav className="nav-bg flex w-full gap-x-3.5 items-end p-3">
        <div className="flex w-full">
          <img className="w-28 mobile-logo" src="/vinyl.webp" />
          <div className="monoton sm:nav-bg">SSVinyl Records</div>
        </div>
        <div className=" nav-links flex w-full gap-x-8 justify-end mobile">
          <a>Home</a>
          <a>Shop All</a>
          <a>Shop by Genre</a>
          <a>Create Listing</a>
        </div>
        <div className="menu-btn hidden">
          <IoMdMenu />
        </div>
      </nav>
    </div>
  );
}
