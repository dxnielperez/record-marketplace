import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../constants';

export function OrderConfirmation() {
  const [showAllItems, setShowAllItems] = useState(false);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        console.log('No sessionId, aborting fetch');
        return;
      }
      if (order) {
        console.log('Order already fetched, skipping');
        return; // Prevent refetching in Strict Mode
      }
      try {
        const url = `${API_URL}/api/confirm-order?session_id=${sessionId}`;
        console.log('Fetching from:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Response: ${text}`
          );
        }
        const result = await response.json();
        console.log('Response data:', result);
        if (result.success) {
          setOrder(result.order);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchOrder();
  }, [sessionId, order]);

  return (
    <div className="min-h-screen flex flex-col">
      {!order && <div className="text-center p-4">Loading...</div>}
      {order && (
        <div className="max-w-5xl mx-auto p-4 flex-grow">
          <h1 className="text-xl text-center">Thank you for your order!</h1>
          <div className="text-center mt-2">
            Order number: <span className="underline">{sessionId}</span>
          </div>
          <div className="text-center mt-1">
            Your order has been confirmed and you will receive an email at{' '}
            {order.customerEmail}
          </div>
          <div className="mt-6 space-y-4">
            {order.purchasedItems
              .slice(0, showAllItems ? undefined : 2)
              .map((item: any, index: number) => (
                <div className="flex gap-4" key={index}>
                  <img
                    src={item.images?.[0]}
                    className="w-24 h-24 rounded-md"
                    alt={`${item.artist} - ${item.albumName}`}
                  />
                  <div>
                    <h3>{`${item.artist} - ${item.albumName}`}</h3>
                    <p>${item.price}</p>
                  </div>
                </div>
              ))}
            {order.purchasedItems.length > 2 && (
              <div className="text-center">
                <button onClick={() => setShowAllItems(!showAllItems)}>
                  {showAllItems ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h3>Shipping To:</h3>
              <p>
                {order.shippingAddress.line1}
                {order.shippingAddress.line2
                  ? ` ${order.shippingAddress.line2}`
                  : ''}
              </p>
              <p>{`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}`}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div>
              <h3>Order Total:</h3>
              <div className="flex justify-between gap-8">
                <span>Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Taxes</span>
                <span>${order.salesTax}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between gap-8">
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
