import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const loadOrderData = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orders.length === 0 && (
          <p className='text-gray-500 mt-6'>No orders found.</p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className='border-t border-b py-6 my-4 text-gray-700'
          >
            <div className='flex flex-col gap-4'>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'
                >
                  <div className='flex items-start gap-6 text-sm'>
                    <img
                      className='w-16 sm:w-20'
                      src={item.image?.[0]}
                      alt={item.name}
                    />

                    <div>
                      <p className='sm:text-base font-medium'>{item.name}</p>

                      <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                        <p>{currency}{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>

                      <p className='mt-1'>
                        Date:{' '}
                        <span className='text-gray-400'>
                          {new Date(order.date).toDateString()}
                        </span>
                      </p>

                      <p className='mt-1'>
                        Payment:{' '}
                        <span className='text-gray-400'>
                          {order.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className='md:w-1/2 flex justify-between'>
                    <div className='flex items-center gap-2'>
                      <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                      <p className='text-sm md:text-base'>{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div className='text-sm'>
                <p>Order Total: <b>{currency}{order.amount}</b></p>

                {order.couponCode && (
                  <p className='text-green-600'>
                    Coupon: {order.couponCode} | Discount: {currency}{order.discountAmount}
                  </p>
                )}
              </div>

              <button
                onClick={loadOrderData}
                className='border px-4 py-2 text-sm font-medium rounded-sm'
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;