import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Genre, Products } from '../types/types';

export default function GenreCatalog() {
  const [products, setProducts] = useState<Products[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalProducts, setOriginalProducts] = useState<Products[]>([]);

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
        const query = searchTerm
          ? `?search=${encodeURIComponent(searchTerm)}`
          : '';
        const res = await fetch(`/api/shop-by-genre/${genreName}${query}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        if (Array.isArray(result)) {
          setProducts(result);
          setOriginalProducts(result);
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
  }, [genreName, searchTerm]);

  const handleSort = useCallback(
    (sortOption) => {
      setSortBy(sortOption);
      setProducts((prevProducts) => {
        const sortedProductsCopy = [...prevProducts];

        switch (sortOption) {
          case 'price-asc':
            sortedProductsCopy.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            sortedProductsCopy.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            sortedProductsCopy.sort((a, b) =>
              `${a.albumName} - ${a.artist}`.localeCompare(
                `${b.albumName} - ${b.artist}`
              )
            );
            break;
          case 'name-desc':
            sortedProductsCopy.sort((a, b) =>
              `${b.albumName} - ${b.artist}`.localeCompare(
                `${a.albumName} - ${a.artist}`
              )
            );
            break;
          case 'default':
            return [...originalProducts];
          default:
            return [...originalProducts];
        }
        return sortedProductsCopy;
      });
    },
    [originalProducts]
  );

  useEffect(() => {
    if (sortBy) {
      handleSort(sortBy);
    }
  }, [sortBy, handleSort]);
  const formatAlbumNameForUrl = (albumName) =>
    albumName.toLowerCase().replace(/\s+/g, '-');
  const results =
    products.length === 1
      ? `${products.length} result`
      : `${products.length} results`;
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
        <div className="flex flex-col gap-4 pb-4 lg:flex-row lg:justify-end">
          <div className="flex flex-row lg:flex-col justify-between order-last lg:order-first w-full">
            <h3 className="text-xl font-medium">All</h3>
            <p>{results}</p>
          </div>

          <input
            id="search"
            className="w-full lg:w-auto order-first lg:order-none border border-black rounded-md px-1 h-min"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <div className="flex flex-row gap-4 justify-between lg:justify-end">
            <div className="dropdown lg:hidden">
              <a className="text-black cursor-pointer hover:underline duration-200 border border-1 border-black px-4 py-1 rounded-md">
                Genres
              </a>
              <div className="dropdown-content">
                <Link
                  to="/shop"
                  className="block py-1 w-full whitespace-nowrap">
                  all
                </Link>
                {genres.map((genre) => (
                  <Link key={genre.genreId} to={`/shop/genre/${genre.name}`}>
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
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
        <div>
          {products.length === 0 && <h2>No records available for sale</h2>}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
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
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]} // Use the first image
                      alt={product.albumName}
                      className="w-full object-cover cursor-pointer hover:opacity-75"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span>No Image Available</span>
                    </div>
                  )}
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
