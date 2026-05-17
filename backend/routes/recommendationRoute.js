import express from 'express';
import authUser from '../middleware/auth.js';
import { getRecommendations, addRecommendationFeedback, trackProductView, saveRecommendationReview, getRecommendationReview, deleteRecommendationReview } from '../controllers/recommendationController.js';

const recommendationRouter = express.Router();

// Delete the user's recommendation review
recommendationRouter.delete('/review', authUser, deleteRecommendationReview);

// Get product recommendations for a user
recommendationRouter.get('/recommendations', authUser, getRecommendations);

// Add feedback for recommendations
recommendationRouter.post('/feedback', authUser, addRecommendationFeedback);

// Track when a user views a product (for recommendation purposes)
recommendationRouter.post('/track-view', authUser, trackProductView);

// Save or update the user's recommendation review
recommendationRouter.post('/review', authUser, saveRecommendationReview);

// Get the user's current recommendation review
recommendationRouter.get('/review', authUser, getRecommendationReview);

export default recommendationRouter;
