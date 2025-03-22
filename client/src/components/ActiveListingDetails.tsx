import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/types';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import { AppContext } from './AppContext';

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
        const res = await fetch(`/api/products/${recordId}`);
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
      {showModal && <div onClick={handleCancel} className="overlay" />}
      <div className="pt-6 mx-auto max-w-7xl px-4 py-10 lg:py-9 lg:px-8 relative z-1">
        <div className="max-w-fit">
          <Link to="/account">
            <nav className="text-xl pb-4 flex gap-[0.5rem] cursor-pointer hover:underline hover:text-slate-500 mobile-back">
              Back to listings
            </nav>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2 lg:pr-8">
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mt-4 lg:mt-0 flex gap-[4rem]">
              {`${product.artist} - ${product.albumName}`}
              <div className="flex pt-[0.5rem] text-2xl gap-[2rem] cursor-pointer">
                <MdEdit
                  onClick={() => navigate('/create', { state: product })}
                  className="hover:text-[#626CF8] transition ease-in-out delay-550"
                />
                <MdDeleteForever
                  onClick={handleDelete}
                  className="hover:text-[#C34667] transition ease-in-out delay-550"
                />
              </div>
            </h1>
            <p className="text-3xl tracking-tight text-gray-900 mt-2">{`$${product.price}`}</p>
            <div className="mt-10">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Genre</h3>
                <h3>{product.genre}</h3>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                <h3>{product.condition}</h3>
              </div>
              <div className="mt-10">
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
      {showModal && (
        <DeleteModal onCancel={handleCancel} onDelete={handleDeleteClick} />
      )}
    </div>
  );
}

function DeleteModal({ onCancel, onDelete }) {
  return (
    <div className="delete-modal flex justify-center">
      <div className="bg-[#BCBEC8] border-[#BCBEC8] p-[5rem] flex flex-col justify-between absolute top-[25rem] border rounded-2xl z-30 mobile-modal">
        <h3 className="pb-[4rem] text-2xl">Are you sure you want to delete?</h3>
        <div className="flex justify-between text-xl">
          <button
            onClick={onCancel}
            className="border-none bg-[white] px-[1rem] py-[0.5rem] rounded-md hover:bg-[#E9E9ED]">
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-[#FBB2B1] px-[1.8rem] py-[0.5rem] rounded-md hover:bg-[#FAA09E]">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
