import React from 'react';

interface ProductSkeletonLoaderProps {
  amount: number;
}

export const ProductSkeletonLoader: React.FC<ProductSkeletonLoaderProps> = ({
  amount = 8,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
    {Array.from({ length: amount }).map((_, index) => (
      <div key={index} className="flex flex-col h-full animate-pulse">
        <div className="w-full h-48 bg-gray-300 rounded-md"></div>
        <div className="flex flex-col flex-grow justify-between p-2">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

interface GenreSkeletonLoaderProps {
  amount: number;
}

export const GenreSkeletonLoader: React.FC<GenreSkeletonLoaderProps> = ({
  amount = 11,
}) => (
  <div className="flex flex-col gap-3 pt-1">
    {Array.from({ length: amount }).map((_, index) => (
      <div
        key={index}
        className="h-5 bg-gray-300 rounded w-1/2 animate-pulse"
      />
    ))}
  </div>
);

interface FeaturedProductSkeletonLoaderProps {}

export const FeaturedProductSkeletonLoader: React.FC<
  FeaturedProductSkeletonLoaderProps
> = () => (
  <div className="w-full flex flex-col lg:flex-row bg-flash-white p-4 rounded-lg animate-pulse">
    <div className="w-full order-1 lg:order-2 aspect-[14/5] lg:aspect-[16/9] bg-gray-300 rounded-lg"></div>
    <div className="w-full flex flex-col mx-auto items-center lg:items-start justify-center gap-6 p-4 order-2 lg:order-1">
      <div className="h-6 bg-gray-300 rounded w-1/2 md:w-1/4"></div>
      <div className="h-6 bg-gray-300 rounded w-2/3 md:w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded w-2/3"></div>
      <div className="h-6 bg-gray-300 rounded w-20"></div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
);

interface CarouselSkeletonLoaderProps {
  amount: number;
}

export const CarouselSkeletonLoader: React.FC<CarouselSkeletonLoaderProps> = ({
  amount,
}) => (
  <div className="w-full max-w-5xl flex overflow-x-scroll p-4 gap-4 scrollbar-none animate-pulse">
    {Array.from({ length: amount }).map((_, index) => (
      <div key={index} className="flex-shrink-0 w-52">
        <div className="w-full h-44 bg-gray-300 rounded-md aspect-square"></div>
        <div className="mt-2 space-y-1 text-center">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    ))}
  </div>
);
