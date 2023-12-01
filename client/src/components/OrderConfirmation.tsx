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
    : purchasedItems.slice(0, 2);

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
  console.log(purchasedItems);
  return (
    <div className="w-full flex justify-center py-[2rem] mb-[2rem]">
      <div className="border border-black min-w-[100rem] px-[4rem] py-[4rem] mobile-confirmation">
        <div className="flex justify-center">
          <h1 className="text-4xl mobile-thanks">
            Thank you {firstName} {lastName} for your order!
          </h1>
        </div>
        <div className="flex justify-center gap-[0.51rem] text-xl mobile-order-number">
          <h3> Order number:</h3>
          <div className="underline">{confirmationNumber}</div>
        </div>
        <div className="text-md flex justify-center mobile-order-number">
          Your order has been confirmed and you will recieve an email at {email}
        </div>
        <div className="mb-[2rem] mt-[2rem] lg:mb-0 lg:w-[65%]">
          {visibleItems.map((item) => (
            <div className="flex gap-[1rem] mb-[2rem]" key={item.recordId}>
              <div>
                <img
                  src={item.imageSrc}
                  className="max-w-[150px]"
                  alt="Product"
                />
              </div>
              <div className="flex flex-col justify-around">
                <div className="flex w-[20rem] checkout-width">
                  <h3>{`${item.artist} - ${item.albumName}`}</h3>
                </div>
                <h3 className="checkout-width">{`$${item.price}`}</h3>
              </div>
            </div>
          ))}
          {purchasedItems.length > 3 && !showAllItems && (
            <button
              className="text-lg cursor-pointer text-[#255ED0] underline  hover:text-[#1C469C]"
              onClick={() => setShowAllItems(true)}>
              View More
            </button>
          )}
          {showAllItems && (
            <button
              className="text-lg cursor-pointer text-[#255ED0] underline  hover:[#1C469C]"
              onClick={() => setShowAllItems(false)}>
              View Less
            </button>
          )}
        </div>

        <div className="text-xl mb-[2rem] flex justify-between">
          {/* Left Column - Shipping To */}
          <div className="flex flex-col">
            <div>Shipping To:</div>
            <div className="text-base mobile-confirmation-info">
              <p>{`${firstName} ${lastName}`}</p>
              <p>{`${streetAddress} ${unit}`}</p>
              <p>{`${city}, ${stateLive} ${postalCode}`}</p>
            </div>
          </div>

          {/* Right Column - Order Total */}
          <div className="flex flex-col">
            <div>Order Total:</div>
            <div className="text-base mobile-confirmation-info">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{`$${subtotal}`}</p>
              </div>
              <div className="flex justify-between ">
                <p>Taxes</p>

                <p>{`$${salesTax}`}</p>
              </div>
              <div className="border border-l-[0.1rem] border-black"></div>
              <div className="flex justify-between">
                <p>Total</p>
                <p>{`$${totalPrice}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
