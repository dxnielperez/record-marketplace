import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';
import { CarouselSkeletonLoader } from './SkeletonLoader';
interface Item {
  id?: number | string;
  image: string;
  title: string;
  artist: string;
  price?: number | string;
  url?: string;
}

interface SideScrollCarouselProps {
  data?: Item[];
  title?: string;
}

export function SideScrollCarousel({
  data,
  title = 'Browse available items',
}: SideScrollCarouselProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/all-products`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const products = await response.json();
        const transformedData: Item[] = products.map((product: any) => ({
          id: product.recordId,
          image: product.images?.[0] || '',
          title: product.albumName,
          artist: product.artist,
          price: product.price,
          url: `/products/${product.albumName
            .toLowerCase()
            .replace(/\s+/g, '-')}+${product.recordId}`,
        }));

        setItems([...transformedData, ...transformedData, ...transformedData]);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!data) {
      fetchProducts();
    } else {
      setItems([...data, ...data, ...data]);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0 || loading) return;

    const totalItemsWidth = container.scrollWidth / 3;
    container.scrollLeft = totalItemsWidth;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth } = container;
      const totalItemsWidth = scrollWidth / 3;

      if (scrollLeft < totalItemsWidth / 4) {
        container.scrollLeft += totalItemsWidth;
      }

      if (scrollLeft > totalItemsWidth * 2.5) {
        container.scrollLeft -= totalItemsWidth;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items, loading]);

  const formatPrice = (price: number | string | undefined | null): string => {
    if (price === undefined || price === null) return 'N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center pt-4">
      <h2 className="text-xl font-medium text-center mb-4">{title}</h2>
      <div className="w-full flex justify-center">
        {loading ? (
          <CarouselSkeletonLoader amount={6} />
        ) : (
          <div
            ref={scrollContainerRef}
            className="w-full max-w-5xl flex overflow-x-scroll p-4 gap-4 scrollbar-none"
            style={{ scrollBehavior: 'auto' }}>
            {items.map((item, index) => (
              <div
                key={item.title + index}
                className="flex-shrink-0 w-52 cursor-pointer"
                onClick={() => item.url && navigate(item.url)}>
                <img
                  className="w-full h-44 object-contain aspect-square"
                  src={item.image}
                  alt={item.title || 'Item'}
                />
                <div className="mt-2 space-y-1 text-center">
                  {item.title && (
                    <p className="text-sm font-medium">{item.title}</p>
                  )}
                  {item.artist && (
                    <p className="text-sm text-gray-600">{item.artist}</p>
                  )}
                  {item.price && (
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
