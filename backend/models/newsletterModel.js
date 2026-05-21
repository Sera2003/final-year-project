import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    discountCode: { type: String, default: "" },
    subscribedAt: { type: Date, default: Date.now },
    emailSentAt: { type: Date, default: null },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const newsletterModel =
  mongoose.models.newsletter || mongoose.model("newsletter", newsletterSchema);

export default newsletterModel;
