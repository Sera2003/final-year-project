import express from "express";
import authUser from "../middleware/auth.js";
import { permit } from "../middleware/permissions.js";
import {
  getProductReviews,
  addProductReview,
  getAllReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/all", authUser, permit("admin"), getAllReviews);
reviewRouter.get("/:productId", getProductReviews);
reviewRouter.post("/add", authUser, addProductReview);

export default reviewRouter;