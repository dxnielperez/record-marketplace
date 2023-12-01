import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import { FaRegTrashAlt } from 'react-icons/fa';

export function Checkout() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateLive, setStateLive] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [unit, setUnit] = useState('');

  const { cartItems, removeFromCart, handleCheckout } = useContext(AppContext);

  const [showAllItems, setShowAllItems] = useState(false);
  const visibleItems = showAllItems ? cartItems : cartItems.slice(0, 2);

  const navigate = useNavigate();

  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    subtotal += cartItems[i].price;
  }

  const salesTax = Number((subtotal * 0.0725).toFixed(2));
  const totalPrice = salesTax + subtotal;

  async function handleCheckoutClick(event) {
    try {
      event.preventDefault();
      handleCheckout();

      const purchasedItems = cartItems.map((item) => ({
        artist: item.artist,
        albumName: item.albumName,
        price: item.price,
        imageSrc: item.imageSrc,
      }));

      navigate('/OrderConfirmationPage', {
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
    <>
      <div className="w-full flex justify-between felx-col checkout-container">
        <div className="flex flex-col items-center text-2xl w-1/2 order-summary">
          <div className="mb-4 custom-section-header2 mb-[2rem] mt-[2rem] text-2xl flex items-center flex-col w-1/2  flex bg-[#F5F5F5]">
            Order Summary
          </div>

          <div className="text-xl flex flex-col justify-between w-1/2 order-summary">
            <div className="mb-[2rem] mt-[2rem] lg:mb-0 lg:w-[65%]">
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
                    <div className="flex w-[20rem] checkout-width">
                      <h3>{`${item.artist} - ${item.albumName}`}</h3>
                    </div>
                    <h3 className="checkout-width">{`$${item.price}`}</h3>

                    <FaRegTrashAlt
                      onClick={() => removeFromCart(item.itemsId)}
                      className="cursor-pointer hover:text-[red] hover:translate-y-px	transition ease-in-out delay-100"
                    />
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
            <div className="flex justify-between w-full">
              <h3>Subtotal</h3>
              <h3>{`$${subtotal}`}</h3>
            </div>

            <div className="flex justify-between w-full">
              <h3>Taxes</h3>
              <h3>{`$${salesTax}`}</h3>
            </div>

            <div className="flex justify-between w-full">
              <h3>Shipping</h3>
              <h3 className="line-through">{`$${salesTax}`}</h3>
            </div>
            <div className="border-b-[0.15rem] border-black pb-[0.4rem]"></div>
            <div className="flex justify-between w-full">
              <h3>Total</h3>
              <h3>{`$${totalPrice}`}</h3>
            </div>
          </div>
        </div>

        <div className="vl"></div>

        <div className="flex flex-col items-center w-full checkout-form">
          <div>
            <form onSubmit={handleCheckoutClick} className="text-lg w-full ">
              <div className=" text-2xl mb-[2rem] mt-[2rem] flex-col items-center flex bg-[#F5F5F5] custom-section-header">
                Shipping
              </div>
              <div className="flex gap-[2rem] mb-[1rem] ">
                <input
                  className="border w-full h-[2.5rem] pl-1 custom-input"
                  placeholder="First Name"
                  type="text"
                  name="firstname"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  className="border w-full h-[2.5rem] pl-1 custom-input"
                  placeholder="Last Name"
                  type="text"
                  name="lastname"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-[2rem] mb-[1rem] ">
                <input
                  className="border w-full h-[2.5rem] pl-1 custom-input"
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="border w-full h-[2.5rem] pl-1 custom-input"
                  placeholder="Phone (Optional)"
                  type="tel"
                  name="phonenumber"
                />
              </div>
              <div className="mb-[1rem]">
                <input
                  className="border w-full h-[2.5rem] pl-1 custom-input"
                  placeholder="Street Address"
                  type="text"
                  name="streetaddress"
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                />
              </div>

              <div className="mb-[1rem] flex gap-[2rem]">
                <input
                  className="border w-[25%] h-[2.5rem] pl-1 custom-input"
                  placeholder="Apt/Unit (Optional)"
                  type="text"
                  name="unit"
                  onChange={(e) => setUnit(e.target.value)}
                />
                <input
                  className="border w-[25%] h-[2.5rem] pl-1 custom-input"
                  placeholder="City"
                  type="text"
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                />

                <input
                  className="border w-[25%] h-[2.5rem] pl-1 custom-input"
                  placeholder="State"
                  type="text"
                  name="state"
                  onChange={(e) => setStateLive(e.target.value)}
                />

                <input
                  className="border w-[25%] h-[2.5rem] pl-1 custom-input"
                  placeholder="Zip"
                  type="text"
                  name="postalcode"
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="mb-[2rem] mt-[2rem] text-2xl flex items-center flex-col w-full  flex bg-[#F5F5F5]">
                Payment
              </div>
              <div className="mb-[1rem] flex flex-col gap-[1rem] border">
                <div className="flex pl-[0.5rem]">
                  <input type="radio" name="payment" value="Venmo" />
                  <label className="pl-[0.5rem]" htmlFor="Venmo">
                    Venmo
                  </label>
                </div>
                <div className="flex pl-[0.5rem]">
                  <input type="radio" name="payment" value="Cash" />
                  <label className="pl-[0.5rem]" htmlFor="Cash">
                    Cash on Delivery
                  </label>
                </div>
              </div>
              <div className="w-full flex justify-between pb-[8rem] mobile-cancel-place">
                <button
                  type="reset"
                  className="border px-[2rem] py-[0.35rem] bg-[#C9CBCF] hover:bg-[#B3B7BC]">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border px-[2rem] py-[0.35rem] bg-[#93FF85] hover:bg-[#6FFF5C]">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="vl"></div>

        {/* <div className="mb-[2rem] mt-[2rem] lg:mb-0 lg:w-[65%]">
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
                    <div className="flex w-[20rem] checkout-width">
                      <h3>{`${item.artist} - ${item.albumName}`}</h3>
                    </div>
                    <h3 className="checkout-width">{`$${item.price}`}</h3>

                    <FaRegTrashAlt
                      onClick={() => removeFromCart(item.itemsId)}
                      className="cursor-pointer hover:text-[red] hover:translate-y-px	transition ease-in-out delay-100"
                    />
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
            </div> */}
      </div>
    </>
  );
}
