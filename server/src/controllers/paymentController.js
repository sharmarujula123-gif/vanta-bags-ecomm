import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

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

  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message: "Order has already been paid",
    });
  }

  let payment = await Payment.findOne({
    order: order._id,
  });

  if (payment && ["created", "pending"].includes(payment.status)) {
    return res.status(200).json({
      success: true,
      message: "Payment already initiated",
      data: {
        payment,
      },
    });
  }

  payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: order.total,
    currency: "INR",
    provider: "test",
    status: "pending",
  });

  return res.status(201).json({
    success: true,
    message: "Payment initiated successfully",
    data: {
      payment,
    },
  });
};

export const verifyPayment = async (req, res) => {
    const { paymentId, success } = req.body;
  
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }
  
    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user._id,
    });
  
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
  
    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been verified",
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
  
    if (success === true) {
      payment.status = "paid";
      payment.paidAt = new Date();
  
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
  
      await payment.save();
      await order.save();
  
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          payment,
          order,
        },
      });
    }
  
    payment.status = "failed";
  
    order.paymentStatus = "failed";
  
    await payment.save();
    await order.save();
  
    return res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      data: {
        payment,
        order,
      },
    });
  };