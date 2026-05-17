import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:4000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Recommendation API functions
export const recommendationService = {
  // Get personalized recommendations
  getRecommendations: async () => {
    try {
      const response = await api.get('/api/recommendation/recommendations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  },

  // Add feedback for a recommendation
  addFeedback: async (productId, feedback) => {
    try {
      const response = await api.post('/api/recommendation/feedback', { productId, feedback });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to record feedback');
    }
  },

  // Track product view
  trackProductView: async (productId) => {
    try {
      const response = await api.post('/api/recommendation/track-view', { productId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to track product view');
    }
  },

  // Get the user's current recommendation review
  getReview: async () => {
    try {
      const response = await api.get('/api/recommendation/review');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch review');
    }
  },

  // Save or update the user's recommendation review
  saveReview: async (review) => {
    try {
      const response = await api.post('/api/recommendation/review', { review });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save review');
    }
  },

  // Delete user recommendation review by ID
  deleteReview: async (id) => {
    try {
      const response = await api.delete(`/api/recommendation/review?id=${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },
};

export default recommendationService;