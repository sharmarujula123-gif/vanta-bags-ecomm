import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";

import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  createOrder
);

router.get(
  "/",
  authenticateUser,
  getMyOrders
);

router.get(
  "/:id",
  authenticateUser,
  getOrderById
);

export default router;