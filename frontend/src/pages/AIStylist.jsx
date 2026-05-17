import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import recommendationService from '../services/recommendationService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AIStylist = () => {
  const { currency, token, setToken, navigate } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review state
  const [review, setReview] = useState('');
  const [savedReviews, setSavedReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fetch recommendations + saved reviews
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [recResponse, reviewResponse] = await Promise.all([
          recommendationService.getRecommendations(),
          recommendationService.getReview(),
        ]);
        setRecommendations(recResponse.recommendations);
        setSavedReviews(reviewResponse.reviews || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        
        if (err.message.includes('No token provided') || err.message.includes('Session expired')) {
           setToken('');
           localStorage.removeItem('token');
           toast.error('Session expired. Please sign in again.');
           navigate('/login');
        } else {
           setError(err.message || 'Failed to load recommendations. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Save review and then refresh recommendations
  const handleSaveReview = async () => {
    if (!review.trim()) {
      toast.info('Please enter a preference to save.');
      return;
    }

    try {
      setReviewLoading(true);
      const res = await recommendationService.saveReview(review);
      setSavedReviews([res.review, ...savedReviews]); // Add new review at the top
      setReview(''); // Clear the input field for new reviews
      toast.success('Preference saved! Refreshing recommendations...');

      // Refresh recommendations with the new review baked into the prompt
      const recResponse = await recommendationService.getRecommendations();
      setRecommendations(recResponse.recommendations);
    } catch (err) {
      console.error('Error saving review:', err);
      toast.error('Failed to save preference.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Delete saved review and refresh recommendations
  const handleDeleteReview = async (id) => {
    try {
      setReviewLoading(true);
      await recommendationService.deleteReview(id);
      setSavedReviews(savedReviews.filter(r => r._id !== id));
      toast.success('Preference cleared! Refreshing recommendations...');

      // Refresh recommendations without the review
      const recResponse = await recommendationService.getRecommendations();
      setRecommendations(recResponse.recommendations);
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to clear preference.');
    } finally {
      setReviewLoading(false);
    }
  };

  // ── Guest gate ────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center text-center gap-6 px-4">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Personalized Recommendations</h1>
          <p className="mt-3 text-gray-500 max-w-md">
            Sign in to unlock outfit recommendations tailored to your style, browsing history, and fitness preferences.
          </p>
        </div>

        {/* What you get */}
        <div className="w-full max-w-sm bg-gray-50 border rounded-xl p-5 text-left space-y-3 text-sm text-gray-700">
          {[
            '✦ Recommendations based on your style & history',
            '✦ Continuously improves the more you browse',
            '✦ Tailored to your fitness preferences',
            '✦ Give feedback to refine your suggestions',
          ].map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            id="ai-stylist-signin-btn"
            onClick={() => navigate('/login')}
            className="bg-black text-white px-7 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
          <button
            id="ai-stylist-signup-btn"
            onClick={() => navigate('/login')}
            className="border border-gray-800 text-gray-800 px-7 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">AI Personalized Recommendations</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">AI Personalized Recommendations</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // ── Authenticated view ────────────────────────────────────────
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Personalized Recommendations</h1>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">We're analyzing your preferences to provide personalized recommendations.</p>
          <p className="text-gray-600">Check back later or browse our collection to help us learn your preferences!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-8">
            Based on your browsing and purchase history, we've curated these recommendations just for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/product/${item._id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={`http://localhost:4000/products/${item.image[0].split('/').pop()}`}
                      alt={item.name}
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${item._id}`} className="hover:text-blue-600">
                    <h3 className="font-medium text-lg truncate">{item.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                  <p className="text-red-500 font-bold mt-2">{currency}{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Review / Preference Section ──────────────────────────── */}
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">Tell Us Your Preferences</h2>
        <p className="text-gray-600 text-sm mb-4">
          Write what you'd like to see or avoid. For example: <em>"I don't want shorts"</em>, <em>"Show me more gym tank tops"</em>, or <em>"Only dark colours"</em>. 
          This will be sent to our AI so your next recommendations match exactly what you want.
        </p>

        <textarea
          id="recommendation-review-input"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="e.g. I prefer oversized hoodies and joggers, no shorts please..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
        />

        <div className="flex items-center gap-4 mt-3 mb-6">
          <button
            id="save-review-btn"
            onClick={handleSaveReview}
            disabled={reviewLoading}
            className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewLoading ? 'Saving...' : 'Save & Refresh'}
          </button>
        </div>

        {savedReviews.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Your Saved Preferences</h3>
            <div className="space-y-3">
              {savedReviews.map((r) => (
                <div key={r._id} className="flex items-start justify-between bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{r.feedback}</p>
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    disabled={reviewLoading}
                    className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium flex items-center transition-colors disabled:opacity-50 shrink-0"
                    title="Delete this preference"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── How it works ─────────────────────────────────────────── */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">How Our AI Recommendations Work</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Analyze your browsing and purchase history</li>
          <li>Identify patterns in your preferences and interests</li>
          <li>Match products with similar characteristics to items you've liked</li>
          <li>Respect your written preferences to filter out unwanted items</li>
          <li>Continuously improve based on your feedback</li>
        </ul>
        <p className="mt-4 text-gray-600">
          The more you interact with our site, the better we get at recommending products you'll love!
        </p>
      </div>
    </div>
  );
};

export default AIStylist;