import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ProductItem from '../components/ProductItem';
import recommendationService from '../services/recommendationService';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getRecommendedSize } from '../utils/sizeRecommendation';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { products = [], currency, addToCart, backendUrl, token, userProfile } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const [aiRecs, setAiRecs] = useState([]);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [tryOnResult, setTryOnResult] = useState('');
const [activeTab, setActiveTab] = useState("description");
const [showReviewsList, setShowReviewsList] = useState(false);
  const recommendedSize = getRecommendedSize(
    userProfile?.bodyMeasurements,
    productData?.sizes || []
  );

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/review/${productId}`);

      if (res.data.success) {
        setReviews(res.data.reviews);
        setReviewCount(res.data.count);
        setAverageRating(res.data.averageRating);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    if (!token) {
      toast.error('Please login to add a review');
      navigate('/login');
      return;
    }

    if (!reviewRating) {
      toast.error('Please choose a star rating');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write your review');
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId,
          rating: reviewRating,
          comment: reviewComment,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setReviewRating(0);
        setReviewComment('');
        fetchReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const trackProductView = async (id) => {
    try {
      await recommendationService.trackProductView(id);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  useEffect(() => {
    if (!products || products.length === 0) return;

    const found = products.find((item) => item._id === productId);

    if (found) {
      setProductData(found);
      setImage(found.image?.[0] || '');
      setSize('');
      setTryOnResult('');
      trackProductView(found._id);
    }
  }, [productId, products]);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (!productData || products.length === 0) return;

    const candidates = products.filter((p) => p._id !== productData._id);
    const picked = [...candidates].sort(() => 0.5 - Math.random()).slice(0, 4);
    setAiRecs(picked);
  }, [productData, products]);

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size first');
      return;
    }

    addToCart(productData._id, size);
  };

  const handleTryOn = async () => {
    if (!token) {
      toast.error('Please sign in to use Virtual Try-On');
      navigate('/login');
      return;
    }

    if (!userProfile?.profilePicture) {
      toast.error('Please update your profile picture to use Virtual Try-On');
      return;
    }

    try {
      setIsTryingOn(true);
      toast.info('Generating try-on result...');

      const res = await axios.post(
        `${backendUrl}/api/tryon`,
        {
          userImageUrl: userProfile.profilePicture,
          productImageUrl: image,
          productId: productData._id,
        },
        { withCredentials: true }
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || 'Try-on failed');
        return;
      }

      setTryOnResult(res.data.resultImageUrl);
      toast.success('Try-on result ready!');
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || 'Server error while generating try-on');
    } finally {
      setIsTryingOn(false);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">

      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-500 text-lg">
                {star <= Math.round(averageRating || 0) ? '★' : '☆'}
              </span>
            ))}

            <p className="pl-2">
              ({reviewCount}) {averageRating > 0 && `${averageRating}/5`}
            </p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            <div>
              <p>Select Size</p>

              {recommendedSize ? (
                <p className="text-sm text-green-700 mt-1">
                  Recommended for your height and weight:{' '}
                  <span className="font-semibold">{recommendedSize}</span>
                </p>
              ) : token ? (
                <p className="text-sm text-gray-500 mt-1">
                  Add height and weight in your profile to get a size recommendation.
                </p>
              ) : null}
            </div>

            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size
                      ? 'border-orange-500'
                      : item === recommendedSize
                      ? 'border-green-600 bg-green-50'
                      : ''
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>

            <button
              onClick={handleTryOn}
              disabled={isTryingOn}
              className={`border px-8 py-3 text-sm ${
                isTryingOn ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              type="button"
            >
              {isTryingOn ? 'GENERATING...' : 'TRY-ON'}
            </button>
          </div>

          {tryOnResult && (
            <div className="mt-8">
              <h3 className="font-medium text-lg mb-4">Try-On Result</h3>
              <img
                src={tryOnResult}
                alt="Try-On Result"
                className="w-[80%] rounded-lg border shadow-sm"
              />
            </div>
          )}

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

 {/* Description & Review Section */}
{/* Description & Review Section */}
<div className="mt-20">
  <div className="flex">
    <button
      type="button"
      onClick={() => setActiveTab("description")}
      className={`border px-5 py-3 text-sm font-bold ${
        activeTab === "description" ? "bg-gray-100" : "bg-white"
      }`}
    >
      Description
    </button>

    <button
      type="button"
      onClick={() => setActiveTab("reviews")}
      className={`border px-5 py-3 text-sm font-bold ${
        activeTab === "reviews" ? "bg-gray-100" : "bg-white"
      }`}
    >
      Reviews ({reviewCount})
    </button>
  </div>

  <div className="border px-6 py-6 text-sm text-gray-600">
    {activeTab === "description" && (
      <div>
        <h3 className="font-medium text-lg text-black mb-3">
          Product Description
        </h3>
        <p className="leading-7">{productData.description}</p>
      </div>
    )}

    {activeTab === "reviews" && (
      <div>
        <div className="mb-8">
          <h3 className="font-medium text-lg text-black mb-3">
            Add Your Review
          </h3>

          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="text-3xl text-yellow-500"
              >
                {star <= reviewRating ? "★" : "☆"}
              </button>
            ))}
          </div>

          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Write your review..."
            className="border w-full p-3 min-h-[100px]"
          />

          <button
            type="button"
            onClick={submitReview}
            className="bg-black text-white px-6 py-2 mt-3"
          >
            Submit Review
          </button>
        </div>

        <hr />

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowReviewsList(!showReviewsList)}
            className="w-full flex items-center justify-between font-medium text-lg text-black mb-3"
          >
            <span>
              Show Reviews {averageRating > 0 && `| ${averageRating}/5`}
            </span>
            <span className="text-xl">
              {showReviewsList ? "⌃" : "⌄"}
            </span>
          </button>

          {showReviewsList && (
            <div>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.userProfilePicture
                              ? `${backendUrl}${review.userProfilePicture}`
                              : assets.profile_icon
                          }
                          alt={review.userName}
                          className="w-10 h-10 rounded-full object-cover border"
                        />

                        <div>
                          <p className="font-medium text-black">{review.userName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="text-yellow-500 font-medium whitespace-nowrap">
                        {"★".repeat(Number(review.rating || 0))}
                        {"☆".repeat(5 - Number(review.rating || 0))}
                      </p>
                    </div>

                    <p className="mt-3 ml-13">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

      {aiRecs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">AI Recommended Outfits</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
            {aiRecs.map((item) => (
              <ProductItem
                key={item._id}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      )}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;