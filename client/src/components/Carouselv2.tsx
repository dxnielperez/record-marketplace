import { useEffect, useState, useRef } from 'react';

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

export function SideScrollCarouselv2({
  data,
  title = 'Browse available items',
}: SideScrollCarouselProps) {
  const [items, setItems] = useState<Item[]>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const formatPrice = (price: number | string | undefined | null): string => {
    if (price === undefined || price === null) return 'N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center pt-4">
      <h2 className="text-xl font-medium text-center py-4 lg:py-8">{title}</h2>
      <div className="w-full flex justify-center">
        <div
          ref={scrollContainerRef}
          className="w-full max-w-5xl flex overflow-x-scroll p-4 gap-4 justify-start scrollbar-none">
          {items?.slice(0, 6).map((item, index) => (
            <div key={item.title + index} className="flex-shrink-0 w-52">
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
      </div>
    </div>
  );
}
