import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Item type with optional fields for flexibility
type Item = {
  id?: number | string;
  image: string;
  title?: string;
  artist?: string;
  price?: number;
  url?: string;
};

// Props type with defaults handled in the component
type SideScrollCarouselProps = {
  data?: Item[];
  title?: string;
};

export function SideScrollCarousel({
  data,
  title = 'Browse available items',
}: SideScrollCarouselProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1086);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch products from API if no data is provided
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/all-products');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const products = await response.json();
        const transformedData: Item[] = products.map((product: any) => ({
          id: product.recordId,
          image: product.images[0],
          title: product.albumName,
          artist: product.artist,
          price: product.price,
          url: `/products/${product.albumName
            .toLowerCase()
            .replace(/\s+/g, '-')}+${product.recordId}`,
        }));
        setItems(transformedData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    if (!data) {
      fetchProducts();
    } else {
      setItems(data);
    }
  }, [data]);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1086);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="py-8">
      <h2 className="text-xl font-medium text-center mb-4">{title}</h2>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-scroll max-w-full mx-auto p-4 scrollbar-none gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => item.url && navigate(item.url)}>
            <img
              className={`w-full ${
                isMobile ? 'h-36' : 'h-48'
              } object-contain aspect-square`}
              src={item.image}
              alt={item.title || 'Item'}
            />
            <div className="p-4 space-y-1 whitespace-wrap">
              {item.title && <p>{item.title}</p>}
              {item.artist && <p>{item.artist}</p>}
              {item.price && <p>{`Price: $${item.price}`}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
