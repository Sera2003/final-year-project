import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";
import { securityLogger, errorLogger } from "../utils/logger.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_DIR = path.join(__dirname, "..", "bin", "users");

const createToken = (id, tokenVersion) => {
  return jwt.sign(
    { id, tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?.&])[A-Za-z\d@$!%*?.&]{8,}$/;

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP settings are missing in backend .env");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
    family: 4,
    connectionTimeout: Number(process.env.SMTP_TIMEOUT_MS || 10000),
    greetingTimeout: Number(process.env.SMTP_TIMEOUT_MS || 10000),
    socketTimeout: Number(process.env.SMTP_TIMEOUT_MS || 10000),
  });
};

const generateResetCode = () => String(Math.floor(100000 + Math.random() * 900000));

const buildCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// -------------------- LOGIN USER --------------------
const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await userModel.findOne({ email });

    if (!user) {
      // security log: user not found
      securityLogger.warn(`Login failed - user not found: ${email}`);
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }


const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  securityLogger.warn(`Login failed - wrong password: ${email}`);
  return res
    .status(401)
    .json({ success: false, message: "Invalid email or password" });
}

const token = createToken(user._id, user.tokenVersion);

res.cookie("authToken", token, buildCookieOptions());

// security log: successful login
securityLogger.info(`Login success - user: ${email}`);

return res.json({
  success: true,
  message: "Login successful",
  token,
});

  } catch (error) {
    // error log: unexpected server error during login
    errorLogger.error({
      event: "Login - Server Error",
      message: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

// -------------------- REGISTER USER --------------------
const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const rawPreferences = req.body.fitnessPreferences;
    
    let fitnessPreferences = [];
    if (rawPreferences) {
      if (Array.isArray(rawPreferences)) {
        fitnessPreferences = rawPreferences;
      } else {
        try {
          fitnessPreferences = JSON.parse(rawPreferences);
        } catch(e) {
          fitnessPreferences = rawPreferences.split(',').map(s=>s.trim());
        }
      }
    }

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      securityLogger.warn(
        `Register failed - user already exists: ${email}`
      );
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      securityLogger.warn(
        `Register failed - invalid email format: ${email}`
      );
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!passwordRegex.test(password)) {
      securityLogger.warn(
        `Register failed - weak password for email: ${email}`
      );
      return res.json({
        success: false,
        message:
          "Password must be at least 8 chars and include uppercase, lowercase, number, and special character.",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Create user in MongoDB first to get the _id ---
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      fitnessPreferences
    });

    const user = await newUser.save();

    // --- Create user directory: backend/bin/users/{userId}/ ---
    const userDir = path.join(USERS_DIR, String(user._id));
    await fs.promises.mkdir(userDir, { recursive: true });

    // --- Save profile picture locally ---
    let profilePictureUrl = "";
    if (req.file) {
      try {
        const ext = path.extname(req.file.originalname) || ".jpg";
        const picFilename = `profile${ext}`;
        const picPath = path.join(userDir, picFilename);
        await fs.promises.writeFile(picPath, req.file.buffer);
        profilePictureUrl = `/users/${user._id}/${picFilename}`;
      } catch (uploadError) {
        console.error("Profile picture save failed:", uploadError);
      }
    }

    // Update profilePicture path in MongoDB
    if (profilePictureUrl) {
      user.profilePicture = profilePictureUrl;
      await user.save();
    }

    // --- Write user_data.json to the user directory ---
    const userData = {
      userId: String(user._id),
      name,
      email,
      profilePicture: profilePictureUrl,
      fitnessPreferences,
      bodyMeasurements: user.bodyMeasurements || {},
      createdAt: new Date().toISOString()
    };
    await fs.promises.writeFile(
      path.join(userDir, "user_data.json"),
      JSON.stringify(userData, null, 2)
    );

    const token = createToken(user._id, user.tokenVersion);

    res.cookie("authToken", token, buildCookieOptions());

    securityLogger.info(`Register success - user: ${email}`);

    return res.json({ success: true, token });
  } catch (error) {
    errorLogger.error({
      event: "Register - Server Error",
      message: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

// -------------------- ADMIN LOGIN --------------------
const adminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    // Find user by email
    const admin = await userModel.findOne({ email });

    if (!admin || admin.role !== "admin") {
      securityLogger.warn(
        `Admin login failed - not found / not admin: ${email}`
      );
      return res.json({
        success: false,
        message: "Admin not found or not authorized",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      securityLogger.warn(`Admin login failed - wrong password: ${email}`);
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = createToken(admin._id, admin.tokenVersion);

    // 🔑 SET COOKIE FOR ADMIN TOO
    res.cookie("authToken", token, buildCookieOptions());

    securityLogger.info(`Admin login success - admin: ${email}`);

    return res.json({
      success: true,
      message: "Admin logged in",
      token,
    });
  } catch (error) {
    errorLogger.error({
      event: "Admin Login - Server Error",
      message: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email." });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: "If this email exists, a reset code was sent." });
    }

    const resetCode = generateResetCode();
    user.passwordResetCode = await bcrypt.hash(resetCode, 10);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const transporter = buildTransporter();
    const from = process.env.PASSWORD_RESET_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to: email,
      subject: "Your WolfFitness password reset code",
      text: `Use this code to reset your WolfFitness password: ${resetCode}. It expires in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Password reset</h2>
          <p>Use this code to reset your WolfFitness password. It expires in 15 minutes.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${resetCode}</p>
        </div>
      `,
    });

    return res.json({ success: true, message: "Reset code sent! Check your email." });
  } catch (error) {
    errorLogger.error({
      event: "Forgot Password - Server Error",
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ success: false, message: error.message || "Failed to send reset code." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    const password = String(req.body.password || "");

    if (!validator.isEmail(email) || !code) {
      return res.status(400).json({ success: false, message: "Email and reset code are required." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 chars and include uppercase, lowercase, number, and special character.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user || !user.passwordResetCode || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code." });
    }

    const isCodeMatch = await bcrypt.compare(code, user.passwordResetCode);
    if (!isCodeMatch) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetCode = "";
    user.passwordResetExpires = null;
    user.tokenVersion = Number(user.tokenVersion || 0) + 1;
    await user.save();

    return res.json({ success: true, message: "Password changed successfully. Please log in." });
  } catch (error) {
    errorLogger.error({
      event: "Reset Password - Server Error",
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// -------------------- LOGOUT USER --------------------
const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id; // set in auth middleware

    await userModel.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 },
    });

    const clearCookieOptions = buildCookieOptions();
    delete clearCookieOptions.maxAge;
    res.clearCookie("authToken", clearCookieOptions);

    securityLogger.info(`Logout success - userId: ${userId}`);

    return res.json({
      success: true,
      message: "Logged out successfully. Session invalidated.",
    });
  } catch (error) {
    errorLogger.error({
      event: "Logout - Server Error",
      message: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ success: false, message: "Logout failed" });
  }
};

// -------------------- GET USER PROFILE --------------------
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// -------------------- UPDATE USER PROFILE --------------------
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bodyMeasurements, removeProfilePicture } = req.body;

    const updatePayload = {};

    // Validate body measurements if provided
    if (bodyMeasurements) {
      const { height, weight, unit } = bodyMeasurements;
      if (height !== undefined && (typeof height !== 'number' || height <= 0 || height > 300)) {
        return res.status(400).json({ success: false, message: "Height must be a positive number (max 300 cm)." });
      }
      if (weight !== undefined && (typeof weight !== 'number' || weight <= 0 || weight > 500)) {
        return res.status(400).json({ success: false, message: "Weight must be a positive number (max 500 kg)." });
      }
      if (unit && !['metric', 'imperial'].includes(unit)) {
        return res.status(400).json({ success: false, message: "Unit must be 'metric' or 'imperial'." });
      }
      updatePayload.bodyMeasurements = {
        height: height || null,
        weight: weight || null,
        unit: unit || 'metric'
      };
    }

    if (removeProfilePicture === true || removeProfilePicture === "true") {
      updatePayload.profilePicture = "";
    }

    // Handle profile picture update if file provided
    let profilePictureUrl;
    if (req.file) {
      try {
        const userDir = path.join(USERS_DIR, String(userId));
        await fs.promises.mkdir(userDir, { recursive: true });
        const ext = path.extname(req.file.originalname) || ".jpg";
        const picFilename = `profile${ext}`;
        const picPath = path.join(userDir, picFilename);
        await fs.promises.writeFile(picPath, req.file.buffer);
        profilePictureUrl = `/users/${userId}/${picFilename}`;
        updatePayload.profilePicture = profilePictureUrl;
      } catch (uploadError) {
        console.error("Profile picture update failed:", uploadError);
      }
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: updatePayload },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // --- Sync user_data.json on disk ---
    try {
      const userDir = path.join(USERS_DIR, String(userId));
      await fs.promises.mkdir(userDir, { recursive: true });
      const userDataPath = path.join(userDir, "user_data.json");

      let existingData = {};
      try {
        const raw = await fs.promises.readFile(userDataPath, "utf-8");
        existingData = JSON.parse(raw);
      } catch (_) {
        // file doesn't exist yet — that's fine
      }

      const updatedData = {
        ...existingData,
        userId: String(userId),
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        fitnessPreferences: user.fitnessPreferences,
        bodyMeasurements: user.bodyMeasurements || {},
        updatedAt: new Date().toISOString()
      };

      await fs.promises.writeFile(userDataPath, JSON.stringify(updatedData, null, 2));
    } catch (fileErr) {
      console.error("Failed to update user_data.json:", fileErr);
      // Non-fatal: DB was already updated
    }

    return res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    errorLogger.error({
      event: "Update Profile - Server Error",
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
const updateDeliveryAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
      latitude,
      longitude
    } = req.body;

    const deliveryAddress = {
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      email: String(email || "").trim().toLowerCase(),
      street: String(street || "").trim(),
      city: String(city || "").trim(),
      state: String(state || "").trim(),
      zipcode: String(zipcode || "").trim(),
      country: String(country || "").trim(),
      phone: String(phone || "").trim(),
      latitude: latitude === "" || latitude === null || latitude === undefined ? null : Number(latitude),
      longitude: longitude === "" || longitude === null || longitude === undefined ? null : Number(longitude),
      updatedAt: new Date()
    };

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: { deliveryAddress } },
      { new: true }
    ).select("-password");

    return res.json({
      success: true,
      message: "Delivery address saved successfully",
      user
    });
  } catch (error) {
    console.error("Update delivery address error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getDeliveryAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("deliveryAddress");
    return res.json({
      success: true,
      deliveryAddress: user?.deliveryAddress || {}
    });
  } catch (error) {
    console.error("Get delivery address error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password -cartData -recommendationFeedback")
      .sort({ _id: -1 });

    return res.json({ success: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, logoutUser, getUserProfile, updateUserProfile, updateDeliveryAddress, getDeliveryAddress, getAllUsers };
