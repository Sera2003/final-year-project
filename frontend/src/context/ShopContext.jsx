import React, { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

// Ensure product image URLs are absolute (backend host)
const normalizeImageUrl = (img, backendUrl) => {
    if (!img) return img;
    const cleanBackend = (backendUrl || '').replace(/\/$/, '');

    if (/^https?:\/\//i.test(img)) {
        try {
            const url = new URL(img);
            if (url.pathname.includes('/products/')) {
                const fileName = url.pathname.split('/products/')[1];
                return `${cleanBackend}/products/${fileName}`;
            }
            return img;
        } catch (e) {
            return img;
        }
    }

    // relative like "/products/x" or just filename
    const fileName = img.includes('/products/') ? img.split('/products/')[1] : img.replace(/^\/+/, '');
    return `${cleanBackend}/products/${fileName}`;
};

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [currency] = useState('$'); // Using state for consistency
    const [delivery_fee] = useState(10);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
const getStoredToken = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");

  if (!token || !expiry) return "";

  if (Date.now() > Number(expiry)) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return "";
  }

  return token;
};

const [token, setToken] = useState(getStoredToken());
    const [userProfile, setUserProfile] = useState(null)
    const [discount, setDiscount] = useState(null)
    const navigate = useNavigate();

const addToCart = async (itemId, size) => {
    // 1) Block guests
    if (!token) {
        toast.error('Please sign in to add items to your cart');
        navigate('/login');          // send them to Login page
        return;
    }

    // 2) Still require size
    if (!size) {
        toast.error('Select Product Size');
        return;
    }

    // 3) Update local cart
    let cartData = structuredClone(cartItems) || {};

    if (cartData[itemId]) {
        if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
        } else {
            cartData[itemId][size] = 1;
        }
    } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    // 4) Sync with backend (now we are sure token exists)
    try {
        await axios.post(
            backendUrl + '/api/cart/add',
            { itemId, size },
{
  withCredentials: true,
  headers: { token: token || localStorage.getItem("token") }
}        );
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
};


    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = quantity;
        // Remove the item if quantity is 0
        if (quantity <= 0) {
            delete cartData[itemId][size];
            // Remove the item completely if no sizes left
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);

    if (token) {
        try {
            await axios.post(
                backendUrl + '/api/cart/update',
                { itemId, size, quantity },
{
  withCredentials: true,
  headers: { token: token || localStorage.getItem("token") }
}            );
        } catch (error) {
            console.log(error);

            // 401 = session expired / not logged in
            if (error.response && error.response.status === 401) {
                toast.error('Your session expired. Please log in again.');
                return;
            }

            toast.error(error.message);
        }
    }

    };


    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id == items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                }
            }
        }

        return totalAmount;
    }

    const getDiscountAmount = () => {
        const subtotal = getCartAmount();
        if (!discount || subtotal <= 0) return 0;
        return Math.round((subtotal * discount.percent) / 100);
   }

    const getCartTotal = () => {
        const subtotal = getCartAmount();
        if (subtotal <= 0) return 0;
        return subtotal - getDiscountAmount() + delivery_fee;
    }

    const applyDiscountCode = (code) => {
        const normalizedCode = String(code || '').trim().toUpperCase();
        if (normalizedCode !== 'WOLF20') {
            setDiscount(null);
            return { success: false, message: 'Invalid discount code.' };
        }

        setDiscount({ code: 'WOLF20', percent: 20 });
        return { success: true, message: 'WOLF20 applied. You saved 20%!' };
    }

    const removeDiscountCode = () => {
        setDiscount(null);
    }

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            console.log(response.data);  // Check if the response is correct

            if (response.data.success) {
                const normalizedProducts = (response.data.products || []).map((product) => {
                    const images = Array.isArray(product.image)
                        ? product.image
                        : product.image
                            ? [product.image]
                            : [];

                    const normalizedImages = images.map((img) => normalizeImageUrl(img, backendUrl));

                    return { ...product, image: normalizedImages };
                });

                setProducts(normalizedProducts)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

const getUserCart = async () => {
    try {
        const response = await axios.post(
            backendUrl + '/api/cart/get',
            {},
{
  withCredentials: true,
  headers: { token: token || localStorage.getItem("token") }
}        );

        if (response.data.success) {
            setCartItems(response.data.cartData);
        }
    } catch (error) {
        console.log(error);

        // If user is not logged in yet, /cart/get will return 401.
        // That's normal when opening the site as a guest → don't show an error toast.
        if (error.response && error.response.status === 401) {
            // Guest user – just keep empty cart
            setCartItems({});
            return;
        }

        toast.error(error.message);
    }
};

const fetchUserProfile = async () => {
    if (!token) return;
    try {
        const response = await axios.get(backendUrl + '/api/user/profile', {
            withCredentials: true,
            headers: { token: token || localStorage.getItem("token") }
        });
        if (response.data.success) {
            setUserProfile(response.data.user);
        }
    } catch (error) {
        console.log("Error fetching user profile", error);
    }
};

    useEffect(() => {
        getProductsData()

    }, [])

useEffect(() => {
    // Restore token from localStorage (if you still use it as a flag)
    const storedToken = localStorage.getItem('token');
    if (!token && storedToken) {
        setToken(storedToken);
    }

    // Only try to load cart if we *think* the user is logged in
    if (token || storedToken) {
        getUserCart();
        fetchUserProfile();
    }
}, [token]);   // runs once when app loads

    const value = {
        products,currency,delivery_fee,
        search, setSearch, showSearch, setShowSearch, 
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount, getDiscountAmount, getCartTotal,
        discount, applyDiscountCode, removeDiscountCode,
        navigate, backendUrl,
        setToken, token, userProfile, setUserProfile
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
