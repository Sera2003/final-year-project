import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const Delivery = () => {
  const { backendUrl, navigate, setUserProfile } = useContext(ShopContext);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const fetchSavedAddress = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/user/delivery-address",
{
  withCredentials: true,
  headers: { token: token || localStorage.getItem("token") }
}
      );

      if (response.data.success && response.data.deliveryAddress) {
        setAddress((prev) => ({
          ...prev,
          ...response.data.deliveryAddress,
          latitude: response.data.deliveryAddress.latitude || "",
          longitude: response.data.deliveryAddress.longitude || "",
        }));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    fetchSavedAddress();
  }, []);

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAddress((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        toast.success("Location added");
      },
      () => {
        toast.error("Please allow location access");
      }
    );
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        backendUrl + "/api/user/delivery-address",
        address,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserProfile(response.data.user);
        toast.success("Delivery address saved in database");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-16 px-4">
      <h1 className="text-3xl font-semibold mb-6">Delivery Location</h1>

      <form onSubmit={saveAddress} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input name="firstName" value={address.firstName} onChange={handleChange} placeholder="First name" className="border p-3 rounded w-full" required />
          <input name="lastName" value={address.lastName} onChange={handleChange} placeholder="Last name" className="border p-3 rounded w-full" required />
        </div>

        <input name="email" value={address.email} onChange={handleChange} placeholder="Email address" type="email" className="border p-3 rounded" required />
        <input name="street" value={address.street} onChange={handleChange} placeholder="Street / building / floor" className="border p-3 rounded" required />

        <div className="flex gap-3">
          <input name="city" value={address.city} onChange={handleChange} placeholder="City" className="border p-3 rounded w-full" required />
          <input name="state" value={address.state} onChange={handleChange} placeholder="State" className="border p-3 rounded w-full" required />
        </div>

        <div className="flex gap-3">
          <input name="zipcode" value={address.zipcode} onChange={handleChange} placeholder="Zipcode" className="border p-3 rounded w-full" required />
          <input name="country" value={address.country} onChange={handleChange} placeholder="Country" className="border p-3 rounded w-full" required />
        </div>

        <input name="phone" value={address.phone} onChange={handleChange} placeholder="Phone number" className="border p-3 rounded" required />

        <button type="button" onClick={useCurrentLocation} className="bg-gray-800 text-white py-3 rounded hover:bg-black">
          Use My Current Location
        </button>

        {address.latitude && address.longitude && (
          <a
            className="text-sm text-green-700 underline"
            href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open saved location in Google Maps
          </a>
        )}

        <button type="submit" className="bg-black text-white py-3 rounded hover:bg-gray-800">
          Save Delivery Address
        </button>
      </form>
    </div>
  );
};

export default Delivery;