import { useEffect, useState } from 'react';
import { SideScrollCarousel } from '../components/Carousel';
import { SlidingBar } from '../components/SlidingBar';
import { API_URL } from '../constants';
import { Products } from '../types/types';
import { FeaturedProductSkeletonLoader } from '../components/SkeletonLoader';

export function Home() {
  const [product, setProduct] = useState<Products>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch(`${API_URL}/api/all-products`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setProduct(result[0]);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      {loading ? (
        <FeaturedProductSkeletonLoader />
      ) : (
        <div className="w-full flex flex-col lg:flex-row bg-flash-white p-4 rounded-lg">
          <img
            src={product?.images?.[0]}
            alt={`${product?.albumName} by ${product?.artist}`}
            className="w-full lg:w-2/3 order-1 lg:order-2 aspect-[14/5] lg:aspect-[16/9] object-cover"
          />
          <div className="w-full flex flex-col mx-auto items-center lg:items-start justify-center gap-4 p-4 order-2 lg:order-1">
            <h3 className="">Featured Listing</h3>
            <p className="text-xl font-medium">
              {product?.albumName} - {product?.artist}
            </p>
            <p>{product?.info}</p>
            <p className="text-lg font-bold">{product?.price}</p>
            <a
              href={`/products/${product?.albumName
                .toLowerCase()
                .replace(/\s+/g, '-')}+${product?.recordId}`}
              className="w-min whitespace-nowrap text-center px-4 py-[6px] border-1 border border-black rounded-md hover:text-snow bg-emerald">
              Buy Now
            </a>
          </div>
        </div>
      )}

      <div className="my-8">
        <h2 className="text-2xl font-medium text-center mb-4">
          Shop Our Collection
        </h2>
        <div className="flex flex-col md:flex-row justify-around gap-4">
          <div className="text-center">
            <p>
              Discover a hand-picked selection of classic and rare vinyl
              records. Shop now and bring home your next favorite album.
            </p>
          </div>
        </div>
      </div>

      <SlidingBar />
      <SideScrollCarousel />
    </div>
  );
}
