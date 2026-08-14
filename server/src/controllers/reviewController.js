import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(req.params.productId) } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  return res.json({ success: true, data: { reviews, average: stats[0]?.average || 0, count: stats[0]?.count || 0 } });
};

export const createProductReview = async (req, res) => {
  const { rating, title = "", comment } = req.body;
  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || !comment?.trim()) {
    return res.status(400).json({ success: false, message: "Rating from 1-5 and a comment are required" });
  }
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  const purchased = await Order.findOne({ user: req.user._id, "items.product": product._id, paymentStatus: "paid", orderStatus: { $in: ["confirmed", "processing", "shipped", "delivered"] } });
  if (!purchased) return res.status(403).json({ success: false, message: "You can review a product only after purchasing it" });
  try {
    const review = await Review.create({ product: product._id, user: req.user._id, rating: Number(rating), title: title.trim(), comment: comment.trim() });
    const populated = await Review.findById(review._id).populate("user", "name");
    return res.status(201).json({ success: true, message: "Review submitted", data: { review: populated } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "You have already reviewed this product" });
    throw error;
  }
};
