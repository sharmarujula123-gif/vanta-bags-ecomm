import express from "express";

import {
  getCart,
  addToCart,
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

export default router;