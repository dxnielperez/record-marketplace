import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Genre, Products } from '../types/types';
import { API_URL } from '../constants';
import { capitalizeFirstLetter } from '../utils/capitalize';
import { ProductSkeletonLoader, GenreSkeletonLoader } from './SkeletonLoader';

export default function GenreCatalog() {
  const [products, setProducts] = useState<Products[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalProducts, setOriginalProducts] = useState<Products[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [genresLoading, setGenresLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { genreName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getGenres() {
      try {
        setGenresLoading(true);
        const res = await fetch(`${API_URL}/api/get-genre-ids`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setGenres(result);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setGenresLoading(false);
      }
    }
    getGenres();
  }, []);

  useEffect(() => {
    async function getProductsByGenre() {
      if (!genreName) return;

      setProductsLoading(true);
      setError(null);
      setProducts([]);

      try {
        const query = searchTerm
          ? `?search=${encodeURIComponent(searchTerm)}`
          : '';
        const res = await fetch(
          `${API_URL}/api/shop-by-genre/${genreName}${query}`
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();

        if (Array.isArray(result)) {
          setProducts(result);
          setOriginalProducts(result);
        } else {
          console.error('Invalid result is not an array:', result);
          setProducts([]);
          setError('No valid products found for this genre.');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setError('Failed to load products. Please try again later.');
      } finally {
        setProductsLoading(false);
      }
    }
    getProductsByGenre();
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
    if (sortBy) handleSort(sortBy);
  }, [sortBy, handleSort]);

  const formatAlbumNameForUrl = (albumName) =>
    albumName.toLowerCase().replace(/\s+/g, '-');

  const results =
    products.length === 1
      ? `${products.length} result`
      : `${products.length} results`;

  return (
    <div className="min-h-screen flex flex-col xl:flex-row gap-4">
      <div className="hidden xl:block w-64 flex-shrink-0">
        <div className="bg-flash-white p-4 h-full rounded-md">
          <h3 className="mb-2">Genres</h3>
          {genresLoading ? (
            <GenreSkeletonLoader amount={11} />
          ) : (
            <>
              <Link
                to="/shop"
                className="block py-1 relative group w-min whitespace-nowrap">
                All
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
              {genres.map((genre) => (
                <Link
                  key={genre.genreId}
                  to={`/shop/${genre.name}`}
                  className="block py-1 relative group w-min">
                  {capitalizeFirstLetter(genre.name)}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-4 pb-4 xl:flex-row xl:justify-end">
          <div className="flex flex-row xl:flex-col justify-between order-last xl:order-first w-full">
            <h3 className="text-xl font-medium">
              {capitalizeFirstLetter(genreName as string)}
            </h3>
            <p>{results}</p>
          </div>

          <input
            id="search"
            className="w-full xl:w-auto order-first xl:order-none border border-black rounded-md px-4 py-2 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <div className="flex flex-row gap-4 justify-between xl:justify-end">
            <div className="dropdown xl:hidden">
              <a className="text-black cursor-pointer hover:underline duration-200 border border-black px-4 py-2 rounded-md h-10 flex items-center">
                Genres
              </a>
              <div className="dropdown-content">
                <Link
                  to="/shop"
                  className="block py-1 w-full whitespace-nowrap">
                  All
                </Link>
                {genres.map((genre) => (
                  <Link key={genre.genreId} to={`/shop/${genre.name}`}>
                    {capitalizeFirstLetter(genre.name)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-black rounded-md px-4 py-2 h-10">
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
          {productsLoading ? (
            <ProductSkeletonLoader amount={4} />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <h2>No records available for this genre</h2>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <a
                  key={product.recordId}
                  onClick={() =>
                    navigate(
                      `/products/${formatAlbumNameForUrl(product.albumName)}+${
                        product.recordId
                      }`,
                      {
                        state: {
                          genre: genreName,
                        },
                      }
                    )
                  }
                  className="flex flex-col h-full">
                  <div className="w-full h-48">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images?.[0]}
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
                    <h3 className="text-sm line-clamp-2 text-ellipsis">{`${product.albumName}`}</h3>
                    <h3 className="text-sm line-clamp-2 text-ellipsis text-gray-600">{`${product.artist}`}</h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
