import nodemailer from "nodemailer";
import validator from "validator";
import newsletterModel from "../models/newsletterModel.js";

const generateDiscountCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `WOLF20-${suffix}`;
};

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
    connectionTimeout: Number(process.env.SMTP_TIMEOUT_MS || 10000),
    greetingTimeout: Number(process.env.SMTP_TIMEOUT_MS || 10000),
    socketTimeout: Number(process.env.SMTP_TIMEOUT_MS || 10000),
  });
};

const sendDiscountEmail = async (email, discountCode) => {
  const transporter = buildTransporter();
  const from = process.env.NEWSLETTER_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your WolfFitness 20% discount is here",
    text: `Thanks for subscribing to WolfFitness. Use code ${discountCode} to get 20% off your next order.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Thanks for subscribing to WolfFitness</h2>
        <p>Use this code to get 20% off your next order:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${discountCode}</p>
        <p>Train hard, dress sharp.</p>
      </div>
    `,
  });
};

export const subscribeNewsletter = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email." });
    }

    let discountCode = "";
    let isUnique = false;

    while (!isUnique) {
      discountCode = generateDiscountCode();
      const existingCode = await newsletterModel.findOne({ discountCode });
      isUnique = !existingCode;
    }

    const subscriber = await newsletterModel.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          discountCode,
          usedAt: null,
        },
        $setOnInsert: { subscribedAt: new Date() },
      },
      { new: true, upsert: true }
    );

    await sendDiscountEmail(subscriber.email, subscriber.discountCode);

    subscriber.emailSentAt = new Date();
    await subscriber.save();

    return res.json({
      success: true,
      message: "Discount email sent! Check your inbox.",
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send discount email.",
    });
  }
};

export const validateDiscountCode = async (req, res) => {
  try {
    const discountCode = String(req.body.code || "").trim().toUpperCase();

    if (!discountCode) {
      return res.status(400).json({ success: false, message: "Enter a discount code." });
    }

    const discount = await newsletterModel.findOne({ discountCode });
    if (!discount || discount.usedAt) {
      return res.status(400).json({ success: false, message: "Invalid or already used discount code." });
    }

    return res.json({
      success: true,
      code: discount.discountCode,
      percent: 20,
      message: `${discount.discountCode} applied. You saved 20%!`,
    });
  } catch (error) {
    console.error("Discount validation error:", error);
    return res.status(500).json({ success: false, message: "Failed to validate discount code." });
  }
};
