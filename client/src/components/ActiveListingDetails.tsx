import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/types';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import { AppContext } from './AppContext';
import { API_URL } from '../constants';
export function ActiveListingDetails() {
  const [product, setProduct] = useState<Product>();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { recordId } = useParams();
  const { deleteListing } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products/${recordId}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setProduct(result);
        setSelectedImage(result?.images[0]);
      } catch (error) {
        console.error(error);
      }
    }
    loadProduct();
  }, [recordId]);

  if (!product) return null;

  function handleDelete() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
  }

  async function handleDeleteClick() {
    try {
      setShowModal(false);
      const id = product?.recordId;
      if (!id) return null;
      await deleteListing(id);
      navigate('/account');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  }

  function handleImageSelect(imageUrl: string) {
    setSelectedImage(imageUrl);
  }

  return (
    <div className="min-h-screen">
      {showModal && (
        <div
          onClick={handleCancel}
          className="fixed inset-0 bg-black bg-opacity-30"
        />
      )}
      <div className="max-w-2xl lg:max-w-5xl mx-auto">
        <div className="mb-4">
          <Link to="/account" className="group relative">
            Account
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          <span className="">{` > ${product.albumName} `}</span>
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
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-medium">{`${product.artist} - ${product.albumName}`}</h1>
              <div className="flex gap-4 text-xl">
                <MdEdit
                  onClick={() => navigate('/create', { state: product })}
                  className="cursor-pointer"
                />
                <MdDeleteForever
                  onClick={handleDelete}
                  className="cursor-pointer"
                />
              </div>
            </div>
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

            <div>
              <h3 className="font-medium">Description</h3>
              <p>{product.info}</p>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <DeleteModal onCancel={handleCancel} onDelete={handleDeleteClick} />
      )}
    </div>
  );
}

function DeleteModal({ onCancel, onDelete }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-medium mb-4">
          Are you sure you want to delete?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="w-min whitespace-nowrap text-center px-4 py-[6px] border border-black rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="w-min whitespace-nowrap text-center px-4 py-[6px] border border-black rounded-md bg-red-500 text-white hover:bg-red-600">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
