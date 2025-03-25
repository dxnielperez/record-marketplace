import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

type Item = {
  id?: number | string;
  image: string;
  title?: string;
  artist?: string;
  price?: number;
  url?: string;
};

type SideScrollCarouselProps = {
  data?: Item[];
  title?: string;
};

export function SideScrollCarousel({
  data,
  title = 'Browse available items',
}: SideScrollCarouselProps) {
  const [items, setItems] = useState<Item[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/all-products`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const products = await response.json();
        const transformedData: Item[] = products.map((product: any) => ({
          id: product.recordId,
          image: product.images?.[0],
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

  return (
    <div className="pt-4 mx-auto max-w-7xl w-full flex flex-col items-center">
      <h2 className="text-xl font-medium text-center">{title}</h2>
      <div className="w-full flex justify-center">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll w-full max-w-5xl p-4 scrollbar-none gap-4 justify-start">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => item.url && navigate(item.url)}>
              <img
                className={`w-full h-36 h-44'
                object-contain aspect-square`}
                src={item.image}
                alt={item.title || 'Item'}
              />
              <div className="space-y-1 whitespace-wrap w-52 text-center">
                {item.title && <p>{item.title}</p>}
                {item.artist && <p>{item.artist}</p>}
                {item.price && <p>{`Price: $${item.price}`}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
