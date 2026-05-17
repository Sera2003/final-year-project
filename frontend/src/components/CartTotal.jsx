import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { toast } from 'react-toastify';

const CartTotal = () => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    getDiscountAmount,
    getCartTotal,
    discount,
    applyDiscountCode,
    removeDiscountCode
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState('');

  const subtotal = getCartAmount();
  const discountAmount = getDiscountAmount();
  const total = getCartTotal();

  const handleApplyCoupon = () => {
    const result = applyDiscountCode(couponCode);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency}{subtotal}.00</p>
        </div>

        <hr />

        <div className='flex gap-2'>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className='border px-3 py-2 w-full'
            placeholder='Enter discount code'
          />
          <button
            type='button'
            onClick={handleApplyCoupon}
            className='bg-black text-white px-4'
          >
            Apply
          </button>
        </div>

        {discount && (
          <div className='flex justify-between text-green-600'>
            <p>Discount ({discount.code})</p>
            <button
              type='button'
              onClick={removeDiscountCode}
              className='underline'
            >
              -{currency}{discountAmount}.00 Remove
            </button>
          </div>
        )}

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency}{subtotal === 0 ? 0 : delivery_fee}.00</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency}{total}.00</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;