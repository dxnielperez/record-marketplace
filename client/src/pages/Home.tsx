import { SideScrollCarousel } from '../components/Carousel';
import { SlidingBar } from '../components/SlidingBar';

export function Home() {
  return (
    <div>
      <div className="w-full flex flex-col lg:flex-row">
        <img
          src="/bob-3.jpg"
          alt="bob marley"
          className="w-full lg:w-2/3 order-1 lg:order-2 aspect-[14/5] lg:aspect-[16/9] object-cover"
        />

        <div className="w-full flex flex-col mx-auto items-center lg:items-start justify-center gap-4 p-4 order-2 lg:order-1">
          <h3 className="">Album of the Week</h3>
          <p className="text-xl font-medium">Exodus - Bob Marley</p>
          <p>The All Time Classic Album by Bob Marley on Reggae Red Vinyl</p>
          <a
            href="/"
            className="w-min whitespace-nowrap text-center px-4 py-[6px] border-1 border  border-black rounded-md hover:text-snow bg-emerald">
            Buy Now
          </a>
        </div>
      </div>
      <SlidingBar />
      <SideScrollCarousel />
    </div>
  );
}
