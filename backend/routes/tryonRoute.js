import express from "express";
import multer from "multer";
import { runTryOn } from "../controllers/tryonController.js";

const router = express.Router();

// store uploaded image in memory
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/tryon
router.post("/tryon", upload.single("userImage"), runTryOn);

export default router;
