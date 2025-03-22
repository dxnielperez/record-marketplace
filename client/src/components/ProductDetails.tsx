import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { Product } from '../types/types';

export function ProductDetails() {
  const [product, setProduct] = useState<Product>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Track the currently displayed image
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
        setSelectedImage(result.images?.[0] || null); // Set the first image as default
        console.log('result', result);
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
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  const isItemInCart = cartItems.some(
    (item) => item.recordId === product.recordId
  );

  function handleBackClick() {
    navigate(-1);
  }

  // Handler to change the selected image
  function handleImageSelect(imageUrl: string) {
    setSelectedImage(imageUrl);
  }

  return (
    <div className="min-h-screen">
      <div className="pt-6 mx-auto max-w-7xl px-4 py-10 lg:py-9 lg:px-8">
        <button onClick={handleBackClick}>
          <nav className="text-xl pb-4 flex gap-[0.5rem] cursor-pointer hover:underline hover:text-slate-500 mobile-back">
            Back to products
          </nav>
        </button>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2 lg:pr-8">
            {/* Main Image */}
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${product.artist} - ${product.albumName}`}
                  className="h-full w-full object-cover object-center sm:block"
                />
              ) : (
                <p>No images available</p>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(image)}
                    className={`h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      selectedImage === image
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}>
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mt-4 lg:mt-0">
              {`${product.artist} - ${product.albumName}`}
            </h1>

            <p className="text-3xl tracking-tight text-gray-900 mt-2">
              {`$${product.price}`}
            </p>

            <div className="mt-10">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Genre</h3>
                <h3>{product.genre}</h3>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                <h3>{product.condition}</h3>
              </div>

              {isItemInCart ? (
                <div className="mt-6 flex items-center justify-center rounded-md border border-transparent bg-[#CAC9CF] px-[0.5rem] py-3 text-base font-medium text-white cursor-default w-[11rem]">
                  Item already in cart
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="mt-6 flex items-center justify-center rounded-md border border-transparent bg-[#3C82F6] hover:bg-blue-700 px-8 py-3 text-base font-medium text-white focus:outline-none focus:shadow-outline-blue active:bg-blue-800 focus:ring-offset-2">
                  Add to cart
                </button>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mt-10 mb-4">
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
