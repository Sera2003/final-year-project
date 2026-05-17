import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String },
  type: { type: String, enum: ['product_feedback', 'rule'], default: 'product_feedback' },
  feedback: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', feedbackSchema);
