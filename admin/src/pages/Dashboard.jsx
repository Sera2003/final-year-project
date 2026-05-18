import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    if (!token) return;

    try {
      const response = await axios.get(backendUrl + "/api/dashboard/stats", {
        withCredentials: true,
            headers: { token }

      });

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  if (!stats) return <p>Loading dashboard...</p>;

  const ratingPercent =
    stats.reviewsCount > 0
      ? Math.round((stats.goodReviews / stats.reviewsCount) * 100)
      : 0;

  const salesByDate = stats.salesByDate || [];
  const maxSales =
    salesByDate.length > 0
      ? Math.max(...salesByDate.map((item) => item.sales))
      : 0;

  const chartWidth = Math.max(320, salesByDate.length * 95);
  const chartHeight = 230;
  const paddingLeft = 45;
  const paddingTop = 35;
  const graphHeight = 135;
  const bottomY = 175;

  const getPoint = (item, index) => {
    const usableWidth = chartWidth - paddingLeft - 35;
    const x =
      salesByDate.length === 1
        ? chartWidth / 2
        : paddingLeft + index * (usableWidth / (salesByDate.length - 1));

    const y =
      maxSales > 0
        ? bottomY - (Number(item.sales || 0) / maxSales) * graphHeight
        : bottomY;

    return { x, y };
  };

  return (
    <div className="pb-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6">Dashboard</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
        {[
          ["Users", stats.usersCount],
          ["Products", stats.productsCount],
          ["Orders", stats.ordersCount],
          ["Total Sales", `${currency} ${stats.totalSales}`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border p-4 sm:p-5 rounded">
            <p className="text-gray-500 text-sm">{label}</p>
            <h2 className="text-2xl sm:text-3xl font-bold">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6">
        <div className="bg-white border p-4 sm:p-5 rounded">
          <p className="text-gray-500 text-sm">Users Bought</p>
          <h2 className="text-2xl sm:text-3xl font-bold">{stats.usersBought}</h2>
        </div>

        <div className="bg-white border p-4 sm:p-5 rounded">
          <p className="text-gray-500 text-sm">Products Bought</p>
          <h2 className="text-2xl sm:text-3xl font-bold">{stats.totalProductsBought}</h2>
        </div>

        <div className="bg-white border p-4 sm:p-5 rounded">
          <p className="text-gray-500 text-sm">Average Rating</p>
          <h2 className="text-2xl sm:text-3xl font-bold">{stats.averageRating}/5</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white border p-5 sm:p-6 rounded">
          <h4 className="font-semibold mb-5 text-sm sm:text-base">
            Reviews Rated More Than 3 Stars
          </h4>

          <div className="flex items-center justify-center">
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#111 ${ratingPercent * 3.6}deg, #e5e7eb 0deg)`,
              }}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white flex flex-col items-center justify-center">
                <p className="text-2xl sm:text-3xl font-bold">{ratingPercent}%</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {stats.goodReviews}/{stats.reviewsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border p-5 sm:p-6 rounded">
          <h4 className="font-semibold mb-5 text-sm sm:text-base">
            Rating Breakdown
          </h4>

          <div className="flex flex-col gap-3">
            {stats.ratingBreakdown.map((item) => {
              const percent =
                stats.reviewsCount > 0
                  ? Math.round((item.count / stats.reviewsCount) * 100)
                  : 0;

              return (
                <div key={item.rating}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <p>{item.rating} Stars</p>
                    <p>{item.count}</p>
                  </div>

                  <div className="w-full h-2.5 sm:h-3 bg-gray-200 rounded">
                    <div
                      className="h-2.5 sm:h-3 bg-black rounded"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border p-5 sm:p-6 rounded mt-6">
        <h4 className="font-semibold mb-5 text-sm sm:text-base">
          Sales by Date
        </h4>

        {salesByDate.length === 0 ? (
          <p>No sales yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="relative"
              style={{
                minWidth: `${chartWidth}px`,
                height: `${chartHeight}px`,
              }}
            >
              <svg
                width={chartWidth}
                height={chartHeight}
                className="block"
              >
                <line
                  x1={paddingLeft}
                  y1={bottomY}
                  x2={chartWidth - 20}
                  y2={bottomY}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
                <line
                  x1={paddingLeft}
                  y1={paddingTop}
                  x2={paddingLeft}
                  y2={bottomY}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />

                {[0, 0.5, 1].map((tick) => {
                  const y = bottomY - tick * graphHeight;
                  const label = Math.round(maxSales * tick);

                  return (
                    <g key={tick}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={chartWidth - 20}
                        y2={y}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                      <text
                        x={8}
                        y={y + 4}
                        fontSize="11"
                        fill="#6b7280"
                      >
                        {currency}{label}
                      </text>
                    </g>
                  );
                })}

                {salesByDate.map((item, index) => {
                  if (index === salesByDate.length - 1) return null;

                  const start = getPoint(item, index);
                  const end = getPoint(salesByDate[index + 1], index + 1);

                  return (
                    <line
                      key={index}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="black"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {salesByDate.map((item, index) => {
                  const point = getPoint(item, index);

                  return (
                    <g key={index}>
                      <circle cx={point.x} cy={point.y} r="4.5" fill="black" />
                      <text
                        x={point.x}
                        y={point.y - 10}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#111827"
                      >
                        {currency}{item.sales}
                      </text>
                      <text
                        x={point.x}
                        y={bottomY + 22}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#4b5563"
                      >
                        {item.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border p-5 sm:p-6 rounded mt-6">
        <h4 className="font-semibold mb-5 text-sm sm:text-base">Recent Orders</h4>

        <div className="flex flex-col gap-3">
          {stats.recentOrders.length === 0 && <p>No orders yet.</p>}

          {stats.recentOrders.map((order) => (
            <div
              key={order._id}
              className="border p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p className="text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="font-semibold">
                  {currency} {order.amount}
                </p>
                <p className="text-gray-500">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;