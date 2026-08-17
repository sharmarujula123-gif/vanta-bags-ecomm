import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

export const createPayment = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required",
    });
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.orderStatus === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "Cannot pay for a cancelled order",
    });
  }

  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message: "Order has already been paid",
    });
  }

  // Orders created before inventoryReserved/paymentExpiresAt were added
  // may not have these fields. Treat a fresh pending order as reserved.
  if (order.inventoryReserved === undefined) {
    order.inventoryReserved = true;
  }

  if (!order.inventoryReserved) {
    return res.status(400).json({
      success: false,
      message: "Order inventory is no longer reserved",
    });
  }

  if (!order.paymentExpiresAt) {
    order.paymentExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await order.save();
  }

  if (order.paymentExpiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message:
        "Payment session has expired. Please place the order again.",
    });
  }

  let payment = await Payment.findOne({
    order: order._id,
  });

  if (payment?.status === "paid") {
    return res.status(400).json({
      success: false,
      message: "Payment has already been completed",
    });
  }

  let razorpayOrder;

  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return res.status(502).json({
      success: false,
      message:
        "Unable to connect to Razorpay. Check your Razorpay test credentials and try again.",
    });
  }

  if (!payment) {
    payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.total,
      currency: "INR",
      provider: "razorpay",
      providerPaymentId: razorpayOrder.id,
      status: "pending",
    });
  } else {
    payment.provider = "razorpay";
    payment.providerPaymentId = razorpayOrder.id;
    payment.status = "pending";

    await payment.save();
  }

  return res.status(201).json({
    success: true,
    message: "Payment order created successfully",
    data: {
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
      },

      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },

      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    },
  });
};

export const verifyPayment = async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment verification details are required",
    });
  }

  const payment = await Payment.findOne({
    providerPaymentId: razorpayOrderId,
    user: req.user._id,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment record not found",
    });
  }

  if (payment.status === "paid") {
    return res.status(400).json({
      success: false,
      message: "Payment has already been verified",
    });
  }

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    payment.status = "failed";

    await payment.save();

    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  const order = await Order.findOne({
    _id: payment.order,
    user: req.user._id,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.orderStatus === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "This order has already been cancelled",
    });
  }
  payment.status = "paid";
  payment.paidAt = new Date();
  
  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  
  // Payment is complete, so the temporary payment expiry
  // is no longer needed.
  order.paymentExpiresAt = null;
  
  // Stock remains reserved because the order is now confirmed.
  order.inventoryReserved = true;
  
  await payment.save();
  await order.save();
  
  // Clear cart only after successful payment.
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [] } }
  );

  return res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: {
      payment,
      order,
    },
  });
};

export const handleWebhook = async (req, res) => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    return res.status(503).json({
      success: false,
      message: "Razorpay webhook is not configured",
    });
  }

  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Webhook signature missing",
    });
  }

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET
    )
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  let event;

  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook payload",
    });
  }

  try {
    if (event.event === "payment.captured") {
      const paymentEntity =
        event.payload.payment.entity;

      const payment = await Payment.findOne({
        providerPaymentId: paymentEntity.order_id,
      });

      if (!payment) {
        return res.status(200).json({
          success: true,
          message: "Payment record not found",
        });
      }

      if (payment.status !== "paid") {
        payment.status = "paid";
        payment.paidAt = new Date();

        await payment.save();

        await Order.findByIdAndUpdate(payment.order, {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          paymentExpiresAt: null,
          inventoryReserved: true,
        });
      }
    }

    if (event.event === "payment.failed") {
      const paymentEntity =
        event.payload.payment.entity;

      const payment = await Payment.findOne({
        providerPaymentId: paymentEntity.order_id,
      });

      if (payment && payment.status !== "paid") {
        payment.status = "failed";

        await payment.save();

        await Order.findByIdAndUpdate(payment.order, {
          paymentStatus: "failed",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error(
      "Webhook processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};