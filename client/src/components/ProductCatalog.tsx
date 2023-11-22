import { useEffect, useState } from 'react';

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
export default function ProductCatalog() {
  const [products, setProducts] = useState<Products[]>([]);

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
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-[110rem] lg:px-8 mobile-format">
        <h2 className="text-4xl mb-[2rem]">All Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product.recordId} className="group">
              <div className="">
                <div className="parent w-[14rem] h-[14rem] sm:w-[10rem] md:w-[12rem] md:h-[12rem] lg:h-[20rem] lg:w-[20rem] rounded-xl">
                  <img
                    src={product.imageSrc}
                    className="img-shop h-full w-full h-fit inset-x-0 inset-y-0 object-cover cursor-pointer object-center group-hover:opacity-75"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-2xl text-gray-700">
                {`${product.albumName} - ${product.artist}`}
              </h3>
              <p className="mt-1 text-xl font-medium text-gray-900">
                {`$${product.price}`}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
