import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const auth = async (req, res, next) => {
  try {
    // ⬇️ READ TOKEN FROM COOKIE INSTEAD OF HEADER
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contains: { id, tokenVersion, iat, exp }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 🔐 Compare tokenVersion from token vs database
    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    req.user = user; // attach authenticated user
    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export default auth;
