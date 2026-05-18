import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);

const fetchReviews = async () => {
  const savedToken = token || localStorage.getItem("token");

  if (!savedToken) return;

  try {
    const response = await axios.get(backendUrl + "/api/review/all", {
      withCredentials: true,
      headers: {
        token: savedToken
      }
    });

    if (response.data.success) {
      setReviews(response.data.reviews);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const getProfileImage = (pic) => {
    if (!pic) return assets.profile_icon;
    if (pic.startsWith("http")) return pic;
    return backendUrl + pic;
  };

  const showStars = (rating) => {
    const value = Number(rating || 0);
    return "★".repeat(value) + "☆".repeat(5 - value);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-5">Product Reviews</h3>

      <div className="flex flex-col gap-4">
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((review) => (
          <div
            key={review._id}
className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-sm text-gray-700"          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={getProfileImage(review.userProfilePicture)}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover border"
              />

              <div>
                <p className="font-semibold text-base text-black">
                  {review.userName}
                </p>
                <p className="text-gray-500">
                  {new Date(review.date).toLocaleString()}
                </p>
              </div>
            </div>

            <p>
              <b>Product:</b> {review.productName}
            </p>

            <p>
              <b>Rating:</b>{" "}
              <span className="text-yellow-500 text-lg">
                {showStars(review.rating)}
              </span>
            </p>

            <p>
              <b>Comment:</b> {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;