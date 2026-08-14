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

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  createProduct
);
router.put(
    "/:id",
    authenticateUser,
    requireAdmin,
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