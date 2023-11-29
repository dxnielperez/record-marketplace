import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Product } from '../types/types';
import { MdEdit } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';

export function ActiveListingDetails() {
  const [product, setProduct] = useState<Product>();
  const [showModal, setShowModal] = useState(false);

  const { recordId } = useParams();

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

  function handleDelete() {
    setShowModal(true);
  }
  return (
    <div className="bg-[ghostwhite] min-h-screen">
      <div className="pt-6 mx-auto max-w-7xl px-4 py-10 lg:py-9 lg:px-8">
        <Link to="/SellerDashboard">
          <nav className="text-xl pb-4 flex gap-[0.5rem] cursor-pointer hover:underline hover:text-slate-500 mobile-back">
            Back to listings
          </nav>
        </Link>
        {/* Image gallery */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2 lg:pr-8">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block">
              <img
                src={product.imageSrc}
                className="h-5/6 w-5/6 object-cover object-center sm:block"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="lg:w-1/2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mt-4 lg:mt-0 flex gap-[4rem]">
              {`${product.artist} - ${product.albumName}`}
              <div className="flex pt-[0.5rem] text-2xl gap-[2rem] cursor-pointer">
                <MdEdit className="hover:text-[#626CF8] transition ease-in-out delay-550" />
                <MdDeleteForever
                  onClick={handleDelete}
                  className="hover:text-[#C34667] transition ease-in-out delay-550"
                />
              </div>
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
      {showModal && <DeleteModal />}
    </div>
  );
}

function DeleteModal() {
  return <div>Test</div>;
}
