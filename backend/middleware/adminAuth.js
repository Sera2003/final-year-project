import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded = { id: ... } because of createToken
        const admin = await userModel.findById(decoded.id);

        if (!admin || admin.role !== "admin") {
            return res.json({ success: false, message: "Not Authorized. Admin only." });
        }

        // Optional: attach admin to request
        req.adminId = admin._id;

        next();

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
