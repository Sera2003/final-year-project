import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';

import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    setUserProfile,
    userProfile,
    backendUrl,
  } = useContext(ShopContext);

  const profileImage = userProfile?.profilePicture
    ? userProfile.profilePicture.startsWith('http')
      ? userProfile.profilePicture
      : `${backendUrl}${userProfile.profilePicture}`
    : '';

const savedToken = token || localStorage.getItem("token");
const displayName = userProfile?.name?.split(' ')[0] || 'Profile';
  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        { withCredentials: true } // send auth cookie
      );
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');

      setToken('');
      setCartItems({});
      setUserProfile(null);
      navigate('/login');
    }
  };

  const closeMobileMenu = () => setVisible(false);

  const navItemClass = 'flex flex-col items-center gap-1';
  const navUnderline = 'w-2/4 border-none h-[1.5px] bg-gray-700 hidden';

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className={navItemClass}>
          <p>HOME</p>
          <hr className={navUnderline} />
        </NavLink>

        <NavLink to="/collection" className={navItemClass}>
          <p>COLLECTION</p>
          <hr className={navUnderline} />
        </NavLink>

        {/* ✅ NEW */}
        <NavLink to="/ai-stylist" className={navItemClass}>
          <p>AI STYLIST</p>
          <hr className={navUnderline} />
        </NavLink>

        <NavLink to="/about" className={navItemClass}>
          <p>ABOUT</p>
          <hr className={navUnderline} />
        </NavLink>

        <NavLink to="/contact" className={navItemClass}>
          <p>CONTACT</p>
          <hr className={navUnderline} />
        </NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          onClick={() => {
            setShowSearch(true);
            setVisible(false);
          }}
          src={assets.search_icon}
          className="w-7 cursor-pointer"
          alt="search"
        />

        {/* Profile */}
        <div className="group relative">
          <button
onClick={() => (savedToken ? navigate('/profile') : navigate('/login'))}            className="flex items-center gap-2 cursor-pointer"
            type="button"
          >
            {savedToken && profileImage ? (
              <img
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
                src={profileImage}
                alt={displayName}
              />
            ) : (
              <img
                className="w-7"
                src={assets.profile_icon}
                alt="profile"
              />
            )}
            {savedToken && (
              <span className="hidden lg:block max-w-24 truncate text-sm text-gray-700">
                {displayName}
              </span>
            )}
          </button>

          {/* Dropdown Menu (only if logged in) */}
          {savedToken && (
            <div className="group-hover:block hidden absolute right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">
                My Profile
                </p>
                <p
                  onClick={() => navigate('/orders')}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <NavLink to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-7" alt="cart" />
          <p className="absolute -right-1 -bottom-1 w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[8px] flex items-center justify-center">
            {getCartCount()}
          </p>
        </NavLink>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-7 cursor-pointer sm:hidden"
          alt="menu"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">
          {/* Back */}
          <div
            onClick={closeMobileMenu}
            className="flex items-center gap-2 p-3 cursor-pointer"
          >
            <img
              className="h-7 rotate-90"
              src={assets.dropdown_icon}
              alt="back"
            />
            <p>Back</p>
          </div>

          <NavLink onClick={closeMobileMenu} className="py-2 pl-6 border" to="/">
            HOME
          </NavLink>

          <NavLink
            onClick={closeMobileMenu}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>

          {/* ✅ NEW */}
          <NavLink
            onClick={closeMobileMenu}
            className="py-2 pl-6 border"
            to="/ai-stylist"
          >
            AI STYLIST
          </NavLink>

          <NavLink
            onClick={closeMobileMenu}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={closeMobileMenu}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
