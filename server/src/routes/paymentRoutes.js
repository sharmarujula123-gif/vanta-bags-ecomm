import express from "express";

import {
  createPayment,
  verifyPayment,
} from "../controllers/paymentController.js";

import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  createPayment
);

router.post(
  "/verify",
  authenticateUser,
  verifyPayment
);

export default router;