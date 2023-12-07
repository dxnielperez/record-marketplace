import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type Products = {
  recordId: number;
  imageSrc: string;
  artist: string;
  albumName: string;
  genreId: number;
  condition: string;
  price: number;
  info: string;
  sellerId: number;
};

export function SideScrollCarousel() {
  const [products, setProducts] = useState<Products[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch('/api/all-products');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setProducts(result);
      } catch (error) {
        console.error(error);
      }
    }
    getProducts();
  }, []);

  const handleScrollToBeginning = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToEnd = () => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollWidth - containerWidth,
        behavior: 'smooth',
      });
    }
  };

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
    <>
      <div className="flex justify-center text-2xl bg-[ghostwhite] pt-[1rem] mobile-scroll">
        Browse available records
      </div>
      <div className="relative bg-[ghostwhite] pt-[1rem] pb-[2rem]">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto max-w-screen-lg mx-auto p-4">
          {products.map((product) => (
            <div
              key={product.recordId}
              className={`flex-shrink-0 w-64 mx-2 cursor-pointer w-${
                isMobile ? '48' : '64'
              }`}
              onClick={() =>
                navigate(`/ProductDetailsPage/${product.recordId}`)
              }>
              <img
                className={`w-full ${isMobile ? 'h-36' : 'h-48'} object-cover`}
                src={product.imageSrc}
                alt={`Product ${product.recordId}`}
              />
              <div className="bg-[ghostwhite] p-4">
                <div className="text-lg font-bold mb-2">{product.artist}</div>
                <div className="text-xl font-bold mb-2">
                  {product.albumName}
                </div>
                <div className="text-gray-700">{`Price: $${product.price}`}</div>
              </div>
            </div>
          ))}
        </div>
        {!isMobile && (
          <div>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow cursor-pointer"
              onClick={handleScrollToBeginning}>
              Scroll to Beginning
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow cursor-pointer"
              onClick={handleScrollToEnd}>
              Scroll to End
            </button>
          </div>
        )}
      </div>
    </>
  );
}
