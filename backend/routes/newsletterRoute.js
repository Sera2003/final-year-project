import express from "express";
import { subscribeNewsletter, validateDiscountCode } from "../controllers/newsletterController.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribeNewsletter);
newsletterRouter.post("/validate-code", validateDiscountCode);

export default newsletterRouter;
