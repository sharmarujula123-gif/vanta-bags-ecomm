import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryBySlug,
} from "../controllers/CategoryController.js";

import authenticateUser from "../middleware/authenticateUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// Admin
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  createCategory
);

export default router;