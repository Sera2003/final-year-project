import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export default auth;