import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await userModel.countDocuments({ role: "user" });
    const productsCount = await productModel.countDocuments({});
    const orders = await orderModel.find({});
    const reviews = await reviewModel.find({});

    const completedOrders = orders.filter(
      (order) => order.payment === true || order.paymentMethod === "COD"
    );

    const totalSales = completedOrders.reduce(
      (sum, order) => sum + Number(order.amount || 0),
      0
    );

    const totalProductsBought = completedOrders.reduce((sum, order) => {
      const itemCount = (order.items || []).reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0
      );
      return sum + itemCount;
    }, 0);

    const usersBought = new Set(
      completedOrders.map((order) => String(order.userId))
    ).size;

    const goodReviews = reviews.filter((review) => Number(review.rating || 0) > 3).length;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
        : 0;

    const ratingBreakdown = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: reviews.filter((review) => Number(review.rating) === rating).length,
    }));

    const recentOrders = orders
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

      const salesByDateMap = {};

completedOrders.forEach((order) => {
  const dateKey = new Date(order.date).toLocaleDateString();

  if (!salesByDateMap[dateKey]) {
    salesByDateMap[dateKey] = 0;
  }

  salesByDateMap[dateKey] += Number(order.amount || 0);
});

const salesByDate = Object.entries(salesByDateMap).map(([date, sales]) => ({
  date,
  sales,
}));

    res.json({
      success: true,
      stats: {
        usersCount,
        productsCount,
        ordersCount: orders.length,
        usersBought,
        totalProductsBought,
        totalSales,
        goodReviews,
        reviewsCount: reviews.length,
        averageRating: Number(averageRating.toFixed(1)),
        ratingBreakdown,
        recentOrders,
        salesByDate,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getDashboardStats };