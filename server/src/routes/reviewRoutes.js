import express from "express";
import { getProductReviews, createProductReview } from "../controllers/reviewController.js";
import authenticateUser from "../middleware/authenticateUser.js";
const router = express.Router();
router.get("/:productId", getProductReviews);
router.post("/:productId", authenticateUser, createProductReview);
export default router;
