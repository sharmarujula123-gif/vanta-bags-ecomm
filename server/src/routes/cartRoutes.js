import express from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  } from "../controllers/cartController.js";

import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  getCart
);

router.post(
  "/items",
  authenticateUser,
  addToCart
);
router.patch(
    "/items/:productId",
    authenticateUser,
    updateCartItem
  );
  
  router.delete(
    "/items/:productId",
    authenticateUser,
    removeCartItem
  );
  
  router.delete(
    "/",
    authenticateUser,
    clearCart
  );
  
export default router;