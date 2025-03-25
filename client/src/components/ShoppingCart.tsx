import { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { useContext } from 'react';

export function ShoppingCart() {
  const [showAllItems, setShowAllItems] = useState(false);
  const { cartItems, removeFromCart } = useContext(AppContext);
  const navigate = useNavigate();
  const visibleItems = showAllItems ? cartItems : cartItems.slice(0, 3);

  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    subtotal += cartItems[i].price;
  }

  const salesTax = Number((subtotal * 0.0725).toFixed(2));
  const totalPrice = salesTax + subtotal;

  const items = cartItems.length > 1 ? 'items' : 'item';
  const noItems = cartItems.length === 0;
  console.log(cartItems);
  return (
    <div className="min-h-screen">
      <div className="flex justify-between">
        {!noItems && (
          <div className="pb-4 flex justify-between w-full">
            <h1>Your Cart</h1>
            <Link to="/shop" className="group relative">
              Continue shopping
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        )}
        {noItems && (
          <div className="flex justify-center w-full flex-col">
            <div className="flex justify-center mb-[3rem] mobile-empty-cart">
              Your cart is empty
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="w-max px-2 py-2 border-1 border border-black rounded-md hover:text-snow bg-emerald whitespace-nowrap">
                Start shopping
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="max-w-[420px] lg:max-w-full">
          {visibleItems.map((item) => (
            <div className="flex pb-4" key={item.itemsId}>
              <div>
                <img
                  src={item.images?.[0]}
                  className="max-w-[150px] rounded-md"
                  alt="Product"
                />
              </div>
              <div className="flex flex-col justify-around px-4">
                <h3>{`${item.artist} - ${item.albumName}`}</h3>
                <h3>{`$${item.price}`}</h3>
                <FaRegTrashAlt
                  onClick={() => removeFromCart(item.itemsId)}
                  className="cursor-pointer"
                />
              </div>
            </div>
          ))}
          {cartItems.length > 3 && !showAllItems && (
            <button
              className="group relative"
              onClick={() => setShowAllItems(true)}>
              View More
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </button>
          )}
          {showAllItems && (
            <button
              className="group relative"
              onClick={() => setShowAllItems(false)}>
              View Less
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </button>
          )}
        </div>

        {!noItems && (
          <div className="border flex flex-col gap-1 border-black max-w-[420px] lg:max-w-[400px] w-full h-min p-4 rounded-md">
            <h3>Order Summary</h3>
            <div className="flex justify-between">
              <h3>Subtotal ({`${cartItems.length} ${items}`}) </h3>
              <h3>{`$${subtotal}`}</h3>
            </div>
            <div className="flex justify-between">
              <h3>Taxes</h3>
              <h3>{`$${salesTax}`}</h3>
            </div>
            <hr className="border-black" />
            <div className="flex justify-between">
              <h3>Total</h3>
              <h3>{`$${totalPrice}`}</h3>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => navigate('/checkout')}
                className="w-min whitespace-nowrap text-center px-4 py-[6px] border-2 border-black rounded-md hover:text-snow bg-emerald">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
