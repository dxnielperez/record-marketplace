import { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import { useContext } from 'react';

export function ShoppingCart() {
  const [showAllItems, setShowAllItems] = useState(false);
  const { cartItems } = useContext(AppContext);

  const visibleItems = showAllItems ? cartItems : cartItems.slice(0, 3);

  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    subtotal += cartItems[i].price;
  }

  const salesTax = Number((subtotal * 0.0725).toFixed(2));
  const totalPrice = salesTax + subtotal;

  const items = cartItems.length > 1 ? 'items' : 'item';
  return (
    <div className="pl-[4rem] pr-[4rem] pb-[4rem] bg-[#E9EBED] min-h-screen">
      <div className="text-4xl mb-[2rem] pt-[2rem] flex justify-between ">
        <h1 className="mobile-cart">Your Cart</h1>
        <Link
          to="/ProductPage"
          className="text-lg cursor-pointer hover:underline hover:text-slate-500 mobile-continue">
          Continue shopping
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between text-xl">
        {/* Product Cards */}

        <div className="mb-[2rem] lg:mb-0 lg:w-[65%]">
          {visibleItems.map((item) => (
            <div className="flex gap-[1rem] mb-[2rem]" key={item.itemsId}>
              <div>
                <img
                  src={item.imageSrc}
                  className="max-w-[150px]"
                  alt="Product"
                />
              </div>
              <div className="flex flex-col justify-around">
                <h3>{`${item.artist} - ${item.albumName}`}</h3>
                <h3>{`$${item.price}`}</h3>
                <FaRegTrashAlt className="cursor-pointer hover:text-[red] hover:translate-y-px	transition ease-in-out delay-100" />
              </div>
            </div>
          ))}
          {cartItems.length > 3 && !showAllItems && (
            <button
              className="text-lg cursor-pointer hover:underline hover:text-slate-500"
              onClick={() => setShowAllItems(true)}>
              View More
            </button>
          )}
          {showAllItems && (
            <button
              className="text-lg cursor-pointer hover:underline hover:text-slate-500"
              onClick={() => setShowAllItems(false)}>
              View Less
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="text-3xl border border-black w-[100%] lg:w-[35%] mb-[2rem] lg:mb-0 p-4 max-h-[15rem]">
          <h3 className="mb-[1rem]">Order Summary</h3>
          <div className="flex text-lg justify-between mb-[0.5rem]">
            <h3>Subtotal ({`${cartItems.length} ${items}`}) </h3>
            <h3>{`$${subtotal}`}</h3>
          </div>
          <div className="flex text-lg justify-between mb-[0.5rem]">
            <h3>Taxes</h3>
            <h3>{`$${salesTax}`}</h3>
          </div>
          <hr className="border-black" />
          <div className="flex text-lg justify-between mb-[0.5rem]">
            <h3>Total</h3>
            <h3>{`$${totalPrice}`}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
