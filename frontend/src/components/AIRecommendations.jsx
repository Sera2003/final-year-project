import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import recommendationService from '../services/recommendationService';
import axios from 'axios';

const AIRecommendations = () => {
  const { products, token, cartItems, backendUrl } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchRecommendations = async () => {
      try {
        // Check order history
        const orderRes = await axios.post(backendUrl + '/api/order/userorders', {}, { withCredentials: true });
        const hasOrders = orderRes.data.success && orderRes.data.orders && orderRes.data.orders.length > 0;
        const hasCart = Object.keys(cartItems).length > 0;

        if (hasOrders || hasCart) {
            setHasHistory(true);
            // Try to get personalized recommendations from the API
            const response = await recommendationService.getRecommendations();
            setRecommendations(response.recommendations);
        } else {
            setHasHistory(false);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        // Fallback to bestsellers if API fails
        const bestsellers = products
          .filter(product => product.bestseller)
          .slice(0, 6);

        setRecommendations(bestsellers);
        setLoading(false);
      }
    };

    if (products.length > 0) {
      fetchRecommendations();
    }
  }, [products, token, cartItems, backendUrl]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="my-10">
        <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!hasHistory) {
    return (
        <section className="my-10 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-50 backdrop-blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="bg-white/10 p-4 rounded-full inline-block">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Unleash Personalized AI Suggestions</h2>
                <p className="text-gray-300 max-w-xl mx-auto">
                    Your style is unique. Add items to your cart or make a purchase, and our AI will curate a personalized selection just for you.
                </p>
                <Link to="/collection" className="mt-4 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl">
                    Explore Collection
                </Link>
            </div>
        </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recommended For You</h2>
        <Link to="/ai-stylist" className="text-blue-600 hover:text-blue-800 text-sm">
          See All Recommendations
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendations.map((item) => (
          <Link
            to={`/product/${item._id}`}
            key={item._id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:4000/products/${item.image[0].split('/').pop()}`}
                alt={item.name}
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm truncate">{item.name}</h3>
              <p className="text-red-500 text-sm">${item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AIRecommendations;