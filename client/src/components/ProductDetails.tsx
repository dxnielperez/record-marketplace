import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { Product } from '../types/types';

export function ProductDetails() {
  const [product, setProduct] = useState<Product>();
  const { addToCart, cartItems } = useContext(AppContext);
  const { recordId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${recordId}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setProduct(result);
      } catch (error) {
        console.error(error);
      }
    }
    loadProduct();
  }, [recordId]);

  if (!product) return null;

  async function handleAddToCart() {
    try {
      if (!product) return;
      await addToCart(product);
      navigate('/ShoppingCart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }
  const isItemInCart = cartItems.some(
    (item) => item.recordId === product.recordId
  );

  return (
    <div className="bg-[#E9EBED] min-h-screen">
      <div className="pt-6 mx-auto max-w-7xl px-4 py-10 lg:py-9 lg:px-8">
        <Link to="/ProductPage">
          <nav className="text-xl pb-4 flex gap-[0.5rem] cursor-pointer hover:underline hover:text-slate-500 mobile-back">
            Back to products
          </nav>
        </Link>
        {/* Image gallery */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2 lg:pr-8">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block">
              <img
                src={product.imageSrc}
                className="h-full w-full object-cover object-center sm:block"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="lg:w-1/2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mt-4 lg:mt-0">
              {`${product.artist} - ${product.albumName}`}
            </h1>

            {/* Price */}
            <p className="text-3xl tracking-tight text-gray-900 mt-2">
              {`$${product.price}`}
            </p>
            {/* </div> */}

            <div className="mt-10">
              {/* Genre */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Genre</h3>
                <h3>{product.genre}</h3>
              </div>

              {/* Condition */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                <h3>{product.condition}</h3>
              </div>

              {/* <Link to="/ShoppingCart"> */}

              {isItemInCart ? (
                <div className="mt-6 flex items-center justify-center rounded-md border border-transparent bg-[#CAC9CF]  px-[0.5rem] py-3 text-base font-medium text-white cursor-default w-[11rem]">
                  Item already in cart
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="mt-6 flex items-center justify-center rounded-md border border-transparent bg-[#3C82F6]  hover:bg-blue-700 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 focus:ring-offset-2">
                  Add to cart
                </button>
              )}
              {/* </Link> */}
              <div className="mt-10"></div>
              {/* Description*/}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Description
                </h3>
                <div className="space-y-6">
                  <p className="text-base text-gray-900">{product.info}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
