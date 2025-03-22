import { useContext, useEffect, useState } from 'react';
import { Products } from '../types/types';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

export function ActiveListings() {
  const [activeListings, setActiveListings] = useState<Products[]>([]);
  const navigate = useNavigate();
  const { user, token } = useContext(AppContext);
  useEffect(() => {
    async function getSellersProducts() {
      try {
        const res = await fetch(`/api/active-listings/${user?.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setActiveListings(result);
      } catch (error) {
        console.error(error);
      }
    }
    getSellersProducts();
  }, [user?.userId, token]);

  const formatAlbumNameForUrl = (albumName) =>
    albumName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <div className="bg-[ghostwhite] min-h-screen ">
        <div className="mx-auto max-w-2xl px-4 py-[2rem] sm:px-6 sm:py-[2rem] lg:max-w-[110rem] lg:px-8 mobile-format">
          <h2 className="text-4xl mb-[3rem] ml-[2.4%] mobile-category underline">
            Active Listings
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {activeListings.map((product) => (
              <a
                key={product.recordId}
                style={{ height: '100%' }}
                className="group flex flex-col items-center">
                <div className="">
                  <div className="flex-shrink-0 parent w-[14rem] h-[14rem] sm:w-[10rem] md:w-[12rem] md:h-[12rem] lg:h-[20rem] lg:w-[20rem] ">
                    <img
                      src={product.imageSrc}
                      onClick={() =>
                        navigate(
                          `/products/${formatAlbumNameForUrl(
                            product.albumName
                          )}+${product.recordId}`
                        )
                      }
                      className="img-shop h-full w-full h-fit inset-x-0 inset-y-0 object-cover cursor-pointer object-center group-hover:opacity-75"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-2xl text-gray-700 overflow-hidden ">
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
    </div>
  );
}
