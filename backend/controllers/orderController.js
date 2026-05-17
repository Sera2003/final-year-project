import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const currency = "inr";
const deliveryCharge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderTotals = (items, couponCode) => {
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const normalizedCode = String(couponCode || "").trim().toUpperCase();
  const discountPercent = normalizedCode === "WOLF20" ? 20 : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = subtotal - discountAmount + deliveryCharge;

  return {
    subtotal,
    discountPercent,
    discountAmount,
    totalAmount,
    couponCode: discountPercent ? "WOLF20" : "",
  };
};

const getUserInfoForOrder = async (userId) => {
  const user = await userModel.findById(userId).select("name profilePicture");
  return {
    userName: user?.name || "",
    userProfilePicture: user?.profilePicture || "",
  };
};

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address, couponCode } = req.body;

    const totals = calculateOrderTotals(items, couponCode);
    const userInfo = await getUserInfoForOrder(userId);

    const orderData = {
      userId,
      userName: userInfo.userName,
      userProfilePicture: userInfo.userProfilePicture,
      items,
      address,
      amount: totals.totalAmount,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      couponCode: totals.couponCode,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address, couponCode } = req.body;
    const { origin } = req.headers;

    const totals = calculateOrderTotals(items, couponCode);
    const userInfo = await getUserInfoForOrder(userId);

    const orderData = {
      userId,
      userName: userInfo.userName,
      userProfilePicture: userInfo.userProfilePicture,
      items,
      address,
      amount: totals.totalAmount,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      couponCode: totals.couponCode,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: "WolfFitness Order",
          },
          unit_amount: Math.round(totals.totalAmount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.user._id;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
};