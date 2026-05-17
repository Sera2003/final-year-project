import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import feedbackModel from '../models/feedbackModel.js';

// Advanced recommendation algorithm combining collaborative filtering and content-based filtering
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's data
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user's purchase history from orderModel
    const userOrders = await orderModel.find({ userId, payment: true });
    const purchasedProductIds = userOrders ? userOrders.flatMap(order => order.items.map(item => (item._id || item.productId || "").toString())) : [];

    // Get user's browsing history
    const viewedProductIds = user.viewedProducts || [];

    // Combine purchased and viewed products to get user's interests
    const userInterests = [...new Set([...purchasedProductIds, ...viewedProductIds])].filter(id => id);

    // Get all products
    const allProducts = await productModel.find({});

    // If user has no interaction history, return bestsellers
    if (userInterests.length === 0) {
      const bestsellers = allProducts
        .filter(product => product.bestseller)
        .sort(() => 0.5 - Math.random()) // Shuffle the bestsellers
        .slice(0, 10);

      return res.json({
        success: true,
        recommendations: bestsellers,
        message: 'Showing popular products'
      });
    }

    const scoredProducts = allProducts.map(product => {
      // Don't recommend products the user has already purchased
      if (purchasedProductIds.includes(product._id.toString())) {
        return { product, score: 0 };
      }

      let score = 0;

      // Score based on category similarity
      const categoryMatches = userInterests.filter(interestId => {
        const interestProduct = allProducts.find(p => p._id.toString() === interestId);
        return interestProduct && interestProduct.category === product.category;
      });
      score += categoryMatches.length * 2.0;

      // Score based on subcategory similarity
      const subCategoryMatches = userInterests.filter(interestId => {
        const interestProduct = allProducts.find(p => p._id.toString() === interestId);
        return interestProduct && interestProduct.subCategory === product.subCategory;
      });
      score += subCategoryMatches.length * 1.5;

      // Score based on viewed products
      if (viewedProductIds.includes(product._id.toString())) {
        score += 1.0;
      }

      // Score based on bestseller status
      if (product.bestseller) {
        score += 0.5;
      }

      // Score based on previous feedback
      if (user.recommendationFeedback && user.recommendationFeedback.length > 0) {
        const productFeedback = user.recommendationFeedback.filter(feedback => feedback.productId === product._id.toString());
        productFeedback.forEach(feedback => {
          if (feedback.feedback === 'like') score += 0.3;
          else if (feedback.feedback === 'dislike') score -= 0.5;
          else if (feedback.feedback === 'purchase') score += 1.0;
        });
      }

      return { product, score };
    });

    // Sort by score and take top 10 recommendations
    const recommendations = scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.product);

    // If we don't have enough recommendations, supplement with bestsellers
    if (recommendations.length < 10) {
      const additionalProducts = allProducts
        .filter(product => !recommendations.some(rec => rec._id.equals(product._id)) &&
          !purchasedProductIds.includes(product._id.toString()))
        .sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0))
        .slice(0, 10 - recommendations.length);

      recommendations.push(...additionalProducts);
    }

    res.json({
      success: true,
      recommendations,
      message: 'Personalized recommendations generated successfully'
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};

// Add feedback for recommendations and store in Feedback collection
const addRecommendationFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, feedback } = req.body; // feedback: 'like', 'dislike', or 'purchase'

    // Validate feedback type
    if (!feedback || typeof feedback !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid feedback type, must be text' });
    }

    // Update user's preference data
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add feedback to user's preference data
    user.recommendationFeedback.push({
      productId,
      feedback,
      timestamp: new Date()
    });
    await user.save();

    // Also store in separate Feedback collection
    await feedbackModel.create({
      userId,
      productId,
      feedback,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Feedback recorded successfully'
    });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording feedback',
      error: error.message
    });
  }
};

// Track when a user views a product (for recommendation purposes)
const trackProductView = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Update user's viewed products
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add product to viewed products if not already there
    if (!user.viewedProducts.includes(productId)) {
      user.viewedProducts.push(productId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Product view tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking product view:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking product view',
      error: error.message
    });
  }
};

// Save or update the user's recommendation review text
const saveRecommendationReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { review } = req.body;

    if (typeof review !== 'string' || !review.trim()) {
      return res.status(400).json({ success: false, message: 'Review must be a non-empty string' });
    }

    const newFeedback = await feedbackModel.create({
      userId,
      type: 'rule',
      feedback: review.trim()
    });

    res.json({
      success: true,
      message: 'Review saved successfully',
      review: newFeedback
    });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete the user's recommendation review
const deleteRecommendationReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.query; // Expect the ID of the feedback to delete

    if (!id) {
      return res.status(400).json({ success: false, message: 'Feedback ID is required' });
    }

    const deleted = await feedbackModel.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the user's current recommendation review(s)
const getRecommendationReview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all feedbacks that are general user rules/preferences
    // Match rules by explicit type OR legacy docs (no type, no productId)
    const reviews = await feedbackModel.find({
      userId,
      $or: [
        { type: 'rule' },
        { type: { $exists: false }, productId: { $exists: false } }
      ]
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      reviews: reviews || []
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getRecommendations, addRecommendationFeedback, trackProductView, saveRecommendationReview, getRecommendationReview, deleteRecommendationReview };
