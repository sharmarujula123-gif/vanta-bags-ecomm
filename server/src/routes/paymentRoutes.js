import express from "express";

import {
    createPayment,
    verifyPayment,
    handleWebhook,
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
router.post(
    "/webhook",
    handleWebhook
  );
  
export default router;