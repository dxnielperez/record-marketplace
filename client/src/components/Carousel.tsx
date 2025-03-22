import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type Products = {
  recordId: number;
  images: string[];
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

  const formatAlbumNameForUrl = (albumName) =>
    albumName.toLowerCase().replace(/\s+/g, '-');

  return (
    <>
      <div className="flex justify-center pt-[1rem]">
        Browse available records
      </div>
      <div className="relative pt-[1rem] pb-[2rem]">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto max-w-screen-lg mx-auto p-4 scrollbar-none">
          {products.map((product) => (
            <div
              key={product.recordId}
              className={`flex-shrink-0 w-64 mx-2 cursor-pointer w-${
                isMobile ? '48' : '64'
              }`}
              onClick={() =>
                navigate(
                  `/products/${formatAlbumNameForUrl(product.albumName)}+${
                    product.recordId
                  }`
                )
              }>
              <img
                className={`w-full ${isMobile ? 'h-36' : 'h-48'} object-cover`}
                src={product.images[0]}
                alt={`Product ${product.recordId}`}
              />
              <div className="p-4">
                <div className="text-lg font-bold mb-2">{product.artist}</div>
                <div className="text-xl font-bold mb-2">
                  {product.albumName}
                </div>
                <div className="text-gray-700">{`Price: $${product.price}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
