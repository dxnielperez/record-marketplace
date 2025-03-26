import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export function OrderConfirmation() {
  const [showAllItems, setShowAllItems] = useState(false);

  const location = useLocation();
  const { state } = location;
  const {
    firstName,
    lastName,
    purchasedItems,
    email,
    streetAddress,
    city,
    stateLive,
    postalCode,
    totalPrice,
    subtotal,
    salesTax,
    unit,
  } = state || {};

  const visibleItems = showAllItems
    ? purchasedItems
    : purchasedItems?.slice(0, 2);

  function getOrCreateConfirmationNumber() {
    const storageKey = 'confirmationNumber';
    const storedNumber = localStorage.getItem(storageKey);

    if (storedNumber) {
      return storedNumber;
    } else {
      const randomPart = Math.floor(100 + Math.random() * 900);
      const confirmationNumber = `${randomPart}420`;
      localStorage.setItem(storageKey, confirmationNumber);
      return confirmationNumber;
    }
  }

  const confirmationNumber = getOrCreateConfirmationNumber();

  if (!state || !purchasedItems)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No order data available
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl lg:max-w-5xl mx-auto">
        <div className="bg-white rounded-md shadow-sm p-4">
          <h1 className="text-xl font-medium text-center">
            Thank you {firstName} {lastName} for your order!
          </h1>
          <div className="flex justify-center gap-2 mt-2 text-gray-600">
            <span>Order number:</span>
            <span className="underline">{confirmationNumber}</span>
          </div>
          <div className="text-base text-gray-600 text-center mt-1">
            Your order has been confirmed and you will receive an email at{' '}
            {email}
          </div>

          <div className="mt-6 space-y-4">
            {visibleItems.map((item) => (
              <div className="flex gap-4" key={item.recordId}>
                <div className="flex-shrink-0">
                  <img
                    src={item.images?.[0]}
                    className="w-24 h-24 object-cover rounded-md"
                    alt={`${item.artist} - ${item.albumName}`}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className="text-base font-medium">{`${item.artist} - ${item.albumName}`}</h3>
                  <p>${item.price}</p>
                </div>
              </div>
            ))}
            {purchasedItems.length > 2 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="group relative">
                  {showAllItems ? 'View Less' : 'View More'}{' '}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col lg:flex-row justify-between gap-6 text-xl">
            {/* Left Column - Shipping To */}
            <div className="space-y-2">
              <h3 className="font-medium">Shipping To:</h3>
              <div className="text-base text-gray-600">
                <p>{`${firstName} ${lastName}`}</p>
                <p>{`${streetAddress}${unit ? ` ${unit}` : ''}`}</p>
                <p>{`${city}, ${stateLive} ${postalCode}`}</p>
              </div>
            </div>

            {/* Right Column - Order Total */}
            <div className="space-y-2">
              <h3 className="font-medium">Order Total:</h3>
              <div className="text-base text-gray-600">
                <div className="flex justify-between gap-8">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span>Taxes</span>
                  <span>${salesTax}</span>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="flex justify-between gap-8 font-medium">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
