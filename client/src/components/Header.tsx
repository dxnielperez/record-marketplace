import { TiShoppingCart } from 'react-icons/ti';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';

export function Header() {
  return (
    <div className="mt-2.5 ">
      <div className="text-2xl w-full	flex justify-end gap-x-3.5 nav-bg p-2">
        <IoSearchSharp />
        <FaRegUser />
        <MdOutlineFavoriteBorder />
        <TiShoppingCart />
      </div>
      <nav className="nav-bg flex w-full gap-x-3.5 items-end p-3">
        <div className="flex w-full">
          <img className="w-28" src="/vinyl.webp" />
          <div className="monoton nav-bg mg-left">
            SoundSphere Vinyl Records
          </div>
        </div>
        <div className="flex w-full gap-x-8 justify-end">
          <a>Home</a>
          <a>Shop All</a>
          <a>Shop by Genre</a>
          <a>Create Listing</a>
        </div>
      </nav>
    </div>
  );
}
