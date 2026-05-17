import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);

  const getProfileImage = (pic) => {
    if (!pic) return assets.profile_icon;
    if (pic.startsWith("http")) return pic;
    return backendUrl + pic;
  };

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const response = await axios.get(backendUrl + "/api/user/all", {
        withCredentials: true,
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-5">Users</h3>

      <div className="flex flex-col gap-4">
        {users.map((user) => {
          const address = user.deliveryAddress || {};
          const hasLocation = address.latitude && address.longitude;

          return (
            <div
              key={user._id}
className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-sm text-gray-700"            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={getProfileImage(user.profilePicture)}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div>
                  <p className="font-semibold text-base text-black">
                    {user.name}
                  </p>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="font-medium">Delivery Address:</p>

                {address.street ? (
                  <>
                    <p>
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state}, {address.country},{" "}
                      {address.zipcode}
                    </p>
                    <p>Phone: {address.phone}</p>

                    {hasLocation && (
                      <a
                        className="text-blue-600 underline mt-2 inline-block"
                        href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open user location in Google Maps
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">
                    No delivery address saved yet
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;