import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../constants';
import { AppContext } from './AppContext';

export function OrderConfirmation() {
  const [showAllItems, setShowAllItems] = useState(false);
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const { setCartItems } = useContext(AppContext);
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId || order) return;

      try {
        const response = await fetch(
          `${API_URL}/api/confirm-order?session_id=${sessionId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setOrder(result.order);
          setCartItems([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchOrder();
  }, [sessionId, order, setCartItems]);

  if (!order) {
    navigate('/shop');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Thank you for your order!
          </h1>

          <div className="text-center text-gray-600 mb-6">
            <p>
              Order number:{' '}
              <span className="underline font-medium">{sessionId}</span>
            </p>
            <p className="mt-1">
              Confirmation sent to:{' '}
              <span className="font-medium">{order.customerEmail}</span>
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            {order.purchasedItems
              .slice(0, showAllItems ? undefined : 2)
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img
                    src={item.images?.[0]}
                    alt={`${item.artist} - ${item.albumName}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {item.artist} - {item.albumName}
                    </h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>
              ))}
            {order.purchasedItems.length > 2 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="text-blue-600 hover:text-blue-800 transition-colors">
                  {showAllItems ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Shipping To:</h3>
              <div className="text-gray-600">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postal_code}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Order Total:</h3>
              <div className="text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>${order.salesTax}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
