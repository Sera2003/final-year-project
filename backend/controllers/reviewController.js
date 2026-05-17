import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel.find({ productId }).sort({ date: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
        : 0;

    res.json({
      success: true,
      reviews,
      count: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const addProductReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    const product = await productModel.findById(productId);
    const user = await userModel.findById(userId).select("name profilePicture");

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const reviewRating = Number(rating);

    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      return res.json({ success: false, message: "Please choose a rating from 1 to 5 stars" });
    }

    if (!comment || !comment.trim()) {
      return res.json({ success: false, message: "Please write your review" });
    }

    const newReview = new reviewModel({
      productId,
      productName: product.name,
      userId,
      userName: user?.name || req.user.name || "User",
      userProfilePicture: user?.profilePicture || "",
      rating: reviewRating,
      comment: comment.trim(),
      date: Date.now(),
    });

    await newReview.save();

    res.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getProductReviews, addProductReview, getAllReviews };