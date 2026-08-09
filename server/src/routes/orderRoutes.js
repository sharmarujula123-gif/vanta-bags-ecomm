import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  cancelMyOrder,
} from "../controllers/orderController.js";

import authenticateUser from "../middleware/authenticateUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// ====================
// Customer
// ====================

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

router.patch(
  "/:id/cancel",
  authenticateUser,
  cancelMyOrder
);

// ====================
// Admin
// ====================

router.get(
  "/admin/all",
  authenticateUser,
  requireAdmin,
  getAllOrders
);

router.get(
  "/admin/:id",
  authenticateUser,
  requireAdmin,
  getAdminOrderById
);

router.patch(
  "/admin/:id/status",
  authenticateUser,
  requireAdmin,
  updateOrderStatus
);

// ====================
// Customer - Single Order
// ====================

router.get(
  "/:id",
  authenticateUser,
  getOrderById
);

export default router;