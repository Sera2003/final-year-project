import React from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Navbar = ({ setToken }) => {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${backendUrl}/api/user/logout`,
          {},
          { headers: { token } }
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem("tokenExpiry");
      setToken('');
    }
  };

  return (
<div className="flex items-center py-3 px-[4%] justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">      <img src={assets.logo} className="w-36" alt="Logo" />
<button
  onClick={handleLogout}
  className="border border-gray-300 bg-white hover:bg-gray-100 transition-all duration-200 text-gray-800 px-5 sm:px-7 py-2 rounded-lg text-sm font-medium shadow-sm"
>
  Logout
</button>
    </div>
  );
};

export default Navbar;
