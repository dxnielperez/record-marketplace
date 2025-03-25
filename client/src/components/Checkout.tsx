import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from './AppContext';

export function Checkout() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateLive, setStateLive] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [unit, setUnit] = useState('');

  const { cartItems, handleCheckout } = useContext(AppContext);
  const [showAllItems, setShowAllItems] = useState(false);
  const visibleItems = showAllItems ? cartItems : cartItems.slice(0, 3);
  const navigate = useNavigate();

  const subtotal = cartItems
    .reduce((acc, item) => acc + Number(item.price), 0)
    .toFixed(2);
  const salesTax = Number((Number(subtotal) * 0.0725).toFixed(2));
  const totalPrice = (Number(subtotal) + salesTax).toFixed(2);

  const items = cartItems.length > 1 ? 'items' : 'item';

  async function handleCheckoutClick(event) {
    try {
      event.preventDefault();
      handleCheckout();

      const purchasedItems = cartItems.map((item) => ({
        artist: item.artist,
        albumName: item.albumName,
        price: item.price,
        images: item.images,
      }));

      navigate('/confirmation', {
        state: {
          firstName,
          lastName,
          purchasedItems,
          email,
          streetAddress,
          city,
          postalCode,
          totalPrice,
          subtotal,
          salesTax,
          stateLive,
          unit,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4">
        <div className="max-w-[620px] w-full flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <h1 className="">Checkout</h1>
            <Link to="/cart" className="group relative lg:hidden block">
              Back to Cart
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {visibleItems.map((item) => (
            <div className="flex" key={item.itemsId}>
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
              </div>
            </div>
          ))}
          {cartItems.length > 3 && !showAllItems && (
            <button
              className="group relative w-min whitespace-nowrap mx-auto"
              onClick={() => setShowAllItems(true)}>
              View More
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </button>
          )}
          {showAllItems && (
            <button
              className="group relative w-min whitespace-nowrap mx-auto"
              onClick={() => setShowAllItems(false)}>
              View Less
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </button>
          )}
          <div className="border max-w-[420px] w-full flex-col gap-1 border-black h-min p-4 rounded-md mt-4 lg:block hidden">
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
        </div>

        <div className="max-w-[620px] w-full flex flex-col">
          <form onSubmit={handleCheckoutClick} className="flex flex-col gap-4">
            <div className="w-full flex justify-between whitespace-nowrap">
              <h3>Shipping Information</h3>
              <Link to="/cart" className="group relative hidden lg:block">
                Back to Cart
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <input
                className="border border-black rounded-md p-2"
                placeholder="First Name"
                type="text"
                name="firstname"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                className="border border-black rounded-md p-2"
                placeholder="Last Name"
                type="text"
                name="lastname"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                className="border border-black rounded-md p-2"
                placeholder="Email Address"
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="border border-black rounded-md p-2"
                placeholder="Street Address"
                type="text"
                name="streetaddress"
                onChange={(e) => setStreetAddress(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <input
                  className="border border-black rounded-md p-2 w-full"
                  placeholder="Apt/Unit (Optional)"
                  type="text"
                  name="unit"
                  onChange={(e) => setUnit(e.target.value)}
                />
                <input
                  className="border border-black rounded-md p-2 w-full"
                  placeholder="City"
                  type="text"
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <input
                  className="border border-black rounded-md p-2 w-full"
                  placeholder="State"
                  type="text"
                  name="state"
                  onChange={(e) => setStateLive(e.target.value)}
                />
                <input
                  className="border border-black rounded-md p-2 w-full"
                  placeholder="Zip"
                  type="text"
                  name="postalcode"
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex flex-col gap-2 w-full">
                <h3>Payment Method</h3>
                <div className="flex flex-col gap-2 border border-black rounded-md p-4">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" value="Venmo" />
                    <label htmlFor="Venmo">Venmo</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" value="Cashapp" />
                    <label htmlFor="Cashapp">CashApp</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" value="Apple" />
                    <label htmlFor="Apple">Apple Pay</label>
                  </div>
                </div>
                <div className="border w-full flex flex-col gap-1 border-black h-min p-4 rounded-md lg:hidden">
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
                <div className="flex justify-between gap-4">
                  <button
                    type="reset"
                    className="w-min whitespace-nowrap text-center px-4 py-[6px] border-1 border border-black rounded-md hover:text-snow bg-gray-300">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-min whitespace-nowrap text-center px-4 py-[6px] border-1 border border-black rounded-md hover:text-snow bg-emerald">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
