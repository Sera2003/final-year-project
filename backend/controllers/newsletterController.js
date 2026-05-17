import nodemailer from "nodemailer";
import validator from "validator";
import newsletterModel from "../models/newsletterModel.js";

const DISCOUNT_CODE = "WOLF20";

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
  });
};

const sendDiscountEmail = async (email) => {
  const transporter = buildTransporter();
  const from = process.env.NEWSLETTER_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your WolfFitness 20% discount is here",
    text: `Thanks for subscribing to WolfFitness. Use code ${DISCOUNT_CODE} to get 20% off your next order.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Thanks for subscribing to WolfFitness</h2>
        <p>Use this code to get 20% off your next order:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${DISCOUNT_CODE}</p>
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

    const subscriber = await newsletterModel.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          email,
          discountCode: DISCOUNT_CODE,
          subscribedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    await sendDiscountEmail(subscriber.email);

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
