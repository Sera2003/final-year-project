import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Men');
    setSubCategory('Topwear');
    setBestseller(false);
    setSizes([]);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    if (!image1 && !image2 && !image3 && !image4) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const ImageInput = ({ id, image, setImage }) => (
    <label
      htmlFor={id}
className="w-20 h-20 border rounded flex items-center justify-center cursor-pointer bg-white overflow-hidden"
    >
      <img
        className="w-full h-full object-cover"
        src={!image ? assets.upload_area : URL.createObjectURL(image)}
        alt=""
      />
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id={id}
        hidden
        accept="image/*"
      />
    </label>
  );

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-4xl bg-white border rounded p-4 sm:p-6 flex flex-col gap-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload product details and images.
        </p>
      </div>

      <div>
        <p className="mb-3 font-medium">Upload Images</p>

<div className="flex flex-wrap gap-4">
            <ImageInput id="image1" image={image1} setImage={setImage1} />
          <ImageInput id="image2" image={image2} setImage={setImage2} />
          <ImageInput id="image3" image={image3} setImage={setImage3} />
          <ImageInput id="image4" image={image4} setImage={setImage4} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="mb-2 font-medium">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full border px-3 py-2 rounded outline-none"
            type="text"
            placeholder="Type product name"
            required
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border px-3 py-2 rounded outline-none min-h-[120px]"
            placeholder="Write product description"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="mb-2 font-medium">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full border px-3 py-2 rounded outline-none"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Gym Equipment">Gym Equipment</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full border px-3 py-2 rounded outline-none"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Gym Sets">Gym Sets</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full border px-3 py-2 rounded outline-none"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-3 font-medium">Product Sizes</p>

        <div className="flex flex-wrap gap-3">
          {['S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleSize(item)}
              className={`px-4 py-2 rounded border text-sm ${
                sizes.includes(item)
                  ? 'bg-black text-white border-black'
                  : 'bg-slate-100 text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
        />
        <span>Add to bestseller</span>
      </label>

      <button
        type="submit"
        className="w-full sm:w-32 py-3 bg-black text-white rounded"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;