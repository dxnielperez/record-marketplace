import { FaRegTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function ShoppingCart() {
  return (
    <div className="pl-[4rem] pr-[4rem] pb-[4rem] bg-[#E9EBED]">
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
          <div className="flex gap-[1rem] mb-[2rem]">
            <div>
              <img src="/Logo3.jpg" className="max-w-[150px]" alt="Product" />
            </div>
            <div className="flex flex-col justify-around">
              <h3>Kanye West - Graduation</h3>
              <h3>$44.40</h3>
              <FaRegTrashAlt />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="text-3xl border border-black w-[100%] lg:w-[35%] mb-[2rem] lg:mb-0 p-4">
          <h3 className="mb-[1rem]">Order Summary</h3>
          <div className="flex text-lg justify-between mb-[0.5rem]">
            <h3>Subtotal (1 item) </h3>
            <h3>$44.40</h3>
          </div>
          <div className="flex text-lg justify-between mb-[0.5rem]">
            <h3>Taxes</h3>
            <h3>$4.40</h3>
          </div>
          <hr className="border-black" />
          <div className="flex text-lg justify-between mb-[0.5rem]">
            <h3>Total</h3>
            <h3>$48.80</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
