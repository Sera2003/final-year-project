import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const removeProduct = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
        <p className="text-sm text-gray-500">
          Manage all products in your store.
        </p>
      </div>

      <div className="hidden lg:grid grid-cols-[90px_2fr_1fr_1fr_1fr_90px] items-center py-3 px-4 border bg-gray-100 text-sm font-semibold">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Sub Category</p>
        <p>Price</p>
        <p className="text-center">Action</p>
      </div>

      <div className="flex flex-col gap-3 lg:gap-0">
        {list.length === 0 && (
          <p className="text-gray-500 mt-5">No products found.</p>
        )}

        {list.map((item) => (
          <div
            key={item._id}
            className="bg-white border p-4 lg:p-0 lg:grid lg:grid-cols-[90px_2fr_1fr_1fr_1fr_90px] lg:items-center lg:px-4 lg:py-3 text-sm"
          >
            <div className="flex items-start gap-4 lg:block">
              <img
                className="w-20 h-20 lg:w-14 lg:h-14 object-cover rounded border"
                src={item.image?.[0]}
                alt={item.name}
              />

              <div className="flex-1 lg:hidden">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-gray-500 mt-1">{item.category}</p>
                <p className="text-gray-500">{item.subCategory}</p>
                <p className="font-semibold mt-2">
                  {currency}{item.price}
                </p>
              </div>
            </div>

            <p className="hidden lg:block font-medium text-gray-800">
              {item.name}
            </p>

            <p className="hidden lg:block text-gray-600">
              {item.category}
            </p>

            <p className="hidden lg:block text-gray-600">
              {item.subCategory}
            </p>

            <p className="hidden lg:block font-semibold">
              {currency}{item.price}
            </p>

            <div className="mt-4 lg:mt-0 flex lg:justify-center">
              <button
                onClick={() => removeProduct(item._id)}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;