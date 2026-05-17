import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  productName: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  userName: { type: String, required: true },
  userProfilePicture: { type: String, default: "" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Number, default: Date.now },
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;