import { useCallback, useContext, useEffect, useState } from 'react';
import { Products } from '../types/types';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

export function ActiveListings() {
  const [activeListings, setActiveListings] = useState<Products[]>([]);
  const [originalListings, setOriginalListings] = useState<Products[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, token } = useContext(AppContext);

  // Fetch active listings
  useEffect(() => {
    async function getSellersProducts() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/active-listings/${user?.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setActiveListings(result);
        setOriginalListings(result);
      } catch (error) {
        console.error(error);
      }
    }
    getSellersProducts();
  }, [user?.userId, token]);

  // Filter by search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = originalListings.filter((product) =>
        `${product.albumName} ${product.artist}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setActiveListings(filtered);
    } else {
      setActiveListings([...originalListings]);
    }
  }, [searchTerm, originalListings]);

  // Sort logic
  const handleSort = useCallback(
    (sortOption) => {
      setSortBy(sortOption);
      setActiveListings((prevListings) => {
        const sortedListingsCopy = [...prevListings];

        switch (sortOption) {
          case 'price-asc':
            sortedListingsCopy.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            sortedListingsCopy.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            sortedListingsCopy.sort((a, b) =>
              `${a.albumName} - ${a.artist}`.localeCompare(
                `${b.albumName} - ${b.artist}`
              )
            );
            break;
          case 'name-desc':
            sortedListingsCopy.sort((a, b) =>
              `${b.albumName} - ${b.artist}`.localeCompare(
                `${a.albumName} - ${a.artist}`
              )
            );
            break;
          case 'default':
            return [...originalListings];
          default:
            return [...originalListings];
        }
        return sortedListingsCopy;
      });
    },
    [originalListings]
  );

  useEffect(() => {
    if (sortBy) {
      handleSort(sortBy);
    }
  }, [sortBy, handleSort]);

  const formatAlbumNameForUrl = (albumName) =>
    albumName.toLowerCase().replace(/\s+/g, '-');

  const results =
    activeListings.length === 1
      ? `${activeListings.length} result`
      : `${activeListings.length} results`;

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <div className="flex-1">
        <div className="flex flex-col gap-4 pb-4 xl:flex-row xl:justify-end mx-auto">
          <div className="flex flex-row xl:flex-col justify-between order-last xl:order-first w-full">
            <h3 className="text-xl font-medium">Active Listings</h3>
            <p>{results}</p>
          </div>

          <input
            id="search"
            className="w-full xl:w-auto order-first xl:order-none border border-black rounded-md px-1 h-min"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <div className="flex flex-row gap-4 justify-between xl:justify-end">
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-black rounded-md px-1">
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mx-auto">
          {activeListings.length === 0 && <h2>No active listings available</h2>}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {activeListings.map((product) => (
              <a
                key={product.recordId}
                onClick={() =>
                  navigate(
                    `/account/record/${formatAlbumNameForUrl(
                      product.albumName
                    )}+${product.recordId}`
                  )
                }
                className="flex flex-col h-full">
                <div className="w-full h-48">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.albumName}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-75 rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow justify-between p-2">
                  <h3 className="text-sm line-clamp-2 text-ellipsis">{`${product.albumName} - ${product.artist}`}</h3>
                  <p className="text-sm">${product.price}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
