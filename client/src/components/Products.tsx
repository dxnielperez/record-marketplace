import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Genre, Products } from '../types/types';

export default function ProductCatalog() {
  const [products, setProducts] = useState<Products[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function getGenres() {
      try {
        const res = await fetch('/api/get-genre-ids');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setGenres(result);
      } catch (error) {
        console.error(error);
      }
    }
    getGenres();
  }, []);

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

  const handleSort = useCallback((option) => {
    setSortBy(option);
    setProducts((prevProducts) => {
      const sortedProductsCopy = [...prevProducts];
      if (option === 'price') {
        sortedProductsCopy.sort((a, b) => a.price - b.price);
      } else if (option === 'name') {
        sortedProductsCopy.sort((a, b) =>
          `${a.albumName} - ${a.artist}`.localeCompare(
            `${b.albumName} - ${b.artist}`
          )
        );
      }
      return sortedProductsCopy;
    });
  }, []);

  useEffect(() => {
    if (sortBy) {
      handleSort(sortBy);
    }
  }, [sortBy, handleSort]);
  const formatAlbumNameForUrl = (albumName) =>
    albumName.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="min-h-screen">
      <div className="flex justify-end">
        <label className="pr-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded">
          <option value="">Select</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div>
        {products.length === 0 && <h2>No records available for sale</h2>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Category Column */}
          <div className="flex flex-col w-full h-auto md:h-full bg-gray-100 p-4">
            {genres.map((genre) => {
              const name = genre.name.toLowerCase();
              return (
                <Link to={`/genre/${genre.name}`} key={genre.genreId}>
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Product List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-1 md:col-span-2 lg:col-span-3">
            {products.map((product) => (
              <a
                key={product.recordId}
                onClick={() =>
                  navigate(
                    `/products/${formatAlbumNameForUrl(product.albumName)}+${
                      product.recordId
                    }`
                  )
                }
                className="flex flex-col">
                <div>
                  <img
                    src={product.imageSrc}
                    alt={product.albumName}
                    className="inset-x-0 inset-y-0 object-cover cursor-pointer hover:opacity-75"
                  />
                </div>
                <h3>{`${product.albumName} - ${product.artist}`}</h3>
                <p>{`$${product.price}`}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
