import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: { type: String, default: "user" },
    profilePicture: { type: String, default: "" },
    fitnessPreferences: { type: [String], default: [] },
    tokenVersion: { type: Number, default: 0 },
    passwordResetCode: { type: String, default: "" },
    passwordResetExpires: { type: Date, default: null },

    deliveryAddress: {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        email: { type: String, default: "" },
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipcode: { type: String, default: "" },
        country: { type: String, default: "" },
        phone: { type: String, default: "" },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        updatedAt: { type: Date, default: null }
    },

    bodyMeasurements: {
        height: { type: Number, default: null },
        weight: { type: Number, default: null },
        unit: { type: String, enum: ['metric', 'imperial'], default: 'metric' }
    },

    viewedProducts: { type: [String], default: [] },
    recommendationFeedback: {
        type: [{
            productId: String,
            feedback: { type: String, enum: ['like', 'dislike', 'purchase'] },
            timestamp: { type: Date, default: Date.now }
        }],
        default: []
    },
    recommendationReview: { type: String, default: '' }

}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
