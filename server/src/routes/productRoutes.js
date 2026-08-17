import express from "express";
import {
    createProduct,
    getProducts,
    getProductBySlug,
    updateProduct,
    deactivateProduct,
    activateProduct,
    updateProductStock,
  } from "../controllers/productController.js";

import authenticateUser from "../middleware/authenticateUser.js";
import requireAdmin from "../middleware/requireAdmin.js";
import upload from "../middleware/uploadImages.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  upload.array("images", 10),
  createProduct
);
router.put(
    "/:id",
    authenticateUser,
    requireAdmin,
    upload.array("images", 10),
    updateProduct
  );
  
  router.patch(
    "/:id/stock",
    authenticateUser,
    requireAdmin,
    updateProductStock
  );
  
  router.patch(
    "/:id/activate",
    authenticateUser,
    requireAdmin,
    activateProduct
  );

  router.delete(
    "/:id",
    authenticateUser,
    requireAdmin,
    deactivateProduct
  );
export default router;