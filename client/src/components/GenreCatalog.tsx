import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Genre, Products } from '../types/types';

export default function GenreCatalog() {
  const [products, setProducts] = useState<Products[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
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

  const { genreName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProductsByGenre() {
      try {
        const res = await fetch(`/api/shop-by-genre/${genreName}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        if (Array.isArray(result)) {
          setProducts(result);
        } else {
          console.error('Invalid result is not an array', result);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (genreName) {
      getProductsByGenre();
    }
  }, [genreName]);

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
    <div className="min-h-screen flex flex-col lg:flex-row gap-4">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-flash-white p-4 h-full">
          <h3 className="mb-2">Genres</h3>
          <Link
            to="/shop"
            className="block py-1 relative group w-min whitespace-nowrap">
            all
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre.genreId}
              to={`/shop/genre/${genre.name}`}
              className="block py-1 relative group w-min">
              {genre.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between lg:justify-end gap-4 pb-4">
          <div className="dropdown lg:hidden">
            <a className="text-black cursor-pointer hover:underline duration-200 border border-1 border-black px-4 py-1 rounded-md">
              Genres
            </a>
            <div className="dropdown-content">
              <Link to="/shop" className="block py-1 w-full whitespace-nowrap">
                all
              </Link>
              {genres.map((genre) => (
                <Link key={genre.genreId} to={`/shop/genre/${genre.name}`}>
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          <input id="search" className="bg-emerald text-white" />
          <div>
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
        </div>

        <div>
          {products.length === 0 && <h2>No records available for sale</h2>}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {products ? (
              products.map((product) => (
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
                      className="w-full object-cover cursor-pointer hover:opacity-75"
                    />
                  </div>
                  <h3>{`${product.albumName} - ${product.artist}`}</h3>
                  <p>{`$${product.price}`}</p>
                </a>
              ))
            ) : (
              <div>
                products.length === 0 && <h2>No records available for sale</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
