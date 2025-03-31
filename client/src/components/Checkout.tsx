import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from '../constants';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function Checkout() {
  const [showAllItems, setShowAllItems] = useState(false);
  const { cartItems } = useContext(AppContext);
  const visibleItems = showAllItems ? cartItems : cartItems.slice(0, 3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const subtotal = cartItems
    .reduce((acc, item) => acc + Number(item.price), 0)
    .toFixed(2);
  const salesTax = Number((Number(subtotal) * 0.0725).toFixed(2));
  const totalPrice = (Number(subtotal) + salesTax).toFixed(2);
  const items = cartItems.length > 1 ? 'items' : 'item';

  async function handleCheckoutClick(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Response: ${text}`
        );
      }

      const session = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });
      if (error) {
        setErrorMessage(error.message ?? 'Error');
        console.error(error);
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server. Is it running?');
      console.error('Error:', error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {errorMessage && (
        <div className="text-red-500 text-center">{errorMessage}</div>
      )}
      <div className="relative group w-min whitespace-nowrap mb-4">
        <Link to="/cart">
          Back to Cart
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4">
        <div className="max-w-[620px] w-full flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <h1>Checkout</h1>
          </div>
          {visibleItems.map((item: any) => (
            <div className="flex" key={item.itemsId}>
              <img
                src={item.images?.[0]}
                className="max-w-[150px] rounded-md"
                alt="Product"
              />
              <div className="flex flex-col justify-around px-4">
                <h3>{`${item.artist} - ${item.albumName}`}</h3>
                <h3>{`$${item.price}`}</h3>
              </div>
            </div>
          ))}
          {cartItems.length > 3 && !showAllItems && (
            <button onClick={() => setShowAllItems(true)}>View More</button>
          )}
          {showAllItems && (
            <button onClick={() => setShowAllItems(false)}>View Less</button>
          )}
        </div>
        <div className="max-w-[620px] w-full flex flex-col">
          <div className="border max-w-[620px] w-full flex-col gap-1 border-black h-min p-4 rounded-md">
            <h3>Order Summary</h3>
            <div className="flex justify-between">
              <h3>Subtotal ({`${cartItems.length} ${items}`})</h3>
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
          </div>
          <button
            onClick={handleCheckoutClick}
            className="mt-4 px-4 py-2 border border-black rounded-md">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
