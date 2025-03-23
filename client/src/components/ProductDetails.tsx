import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import { Product } from '../types/types';

export function ProductDetails() {
  const [product, setProduct] = useState<Product | undefined>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart, cartItems } = useContext(AppContext);
  const { recordId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${recordId}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const result = await response.json();
        setProduct(result);
        setSelectedImage(result.images?.[0] || null);
      } catch (error) {
        console.error('Failed to load product:', error);
      }
    };
    loadProduct();
  }, [recordId]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const isItemInCart = cartItems.some(
    (item) => item.recordId === product?.recordId
  );

  const handleImageSelect = (imageUrl: string) => setSelectedImage(imageUrl);

  if (!product) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl lg:max-w-5xl mx-auto">
        <div className="mb-4">
          <Link to="/shop" className="group relative">
            All
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          <span className=""> &gt; {product.albumName}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2">
            <div className="mb-4">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${product.artist} - ${product.albumName}`}
                  className="w-full max-w-[580px] h-[380px] object-cover object-center rounded-md"
                />
              ) : (
                <p>No images available</p>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(image)}
                    className={`h-24 w-24 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      selectedImage === image
                        ? 'border-black'
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

          <div className="lg:w-1/2 space-y-4">
            <h1 className="text-2xl font-medium">{`${product.artist} - ${product.albumName}`}</h1>
            <p className="text-xl">${product.price}</p>

            <div className="space-y-2">
              <div>
                <h3 className="font-medium">Genre</h3>
                <p>{product.genre}</p>
              </div>
              <div>
                <h3 className="font-medium">Condition</h3>
                <p>{product.condition}</p>
              </div>
            </div>

            {isItemInCart ? (
              <div className="flex items-center justify-center w-36 py-2  bg-[#CAC9CF] text-black rounded-md cursor-default">
                Item in cart
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-min whitespace-nowrap text-center px-4 py-[6px] border-1 border border-black rounded-md hover:text-snow bg-emerald">
                Add to cart
              </button>
            )}

            <div>
              <h3 className="font-medium">Description</h3>
              <p>{product.info}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
