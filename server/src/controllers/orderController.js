import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const PAYMENT_EXPIRY_MINUTES = 15;

export const createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  if (
    !shippingAddress?.name ||
    !shippingAddress?.phone ||
    !shippingAddress?.addressLine1 ||
    !shippingAddress?.city ||
    !shippingAddress?.state ||
    !shippingAddress?.postalCode
  ) {
    return res.status(400).json({
      success: false,
      message: "Complete shipping address is required",
    });
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({
        user: req.user._id,
      })
        .populate("items.product")
        .session(session);

      if (!cart || cart.items.length === 0) {
        throw new Error("EMPTY_CART");
      }

      let subtotal = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = item.product;

        if (!product || !product.isActive) {
          throw new Error("PRODUCT_UNAVAILABLE");
        }

        if (item.quantity > product.stock) {
          throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
        }

        subtotal += product.price * item.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images?.[0] || "",
        });
      }

      const shippingFee = subtotal >= 2000 ? 0 : 100;
      const total = subtotal + shippingFee;

      const paymentExpiresAt = new Date(
        Date.now() + PAYMENT_EXPIRY_MINUTES * 60 * 1000
      );

      const [order] = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingFee,
            total,
            paymentStatus: "pending",
            orderStatus: "pending",
            inventoryReserved: true,
            paymentExpiresAt,
          },
        ],
        { session }
      );

      for (const item of cart.items) {
        const result = await Product.updateOne(
          {
            _id: item.product._id,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          { session }
        );

        if (result.modifiedCount !== 1) {
          throw new Error(
            `STOCK_UPDATE_FAILED:${item.product.name}`
          );
        }
      }

    //   cart.items = [];

    //   await cart.save({ session });

      createdOrder = order;
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order: createdOrder,
      },
    });
  } catch (error) {
    if (error.message === "EMPTY_CART") {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    if (error.message === "PRODUCT_UNAVAILABLE") {
      return res.status(400).json({
        success: false,
        message:
          "One or more products in your cart are unavailable",
      });
    }

    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = error.message.split(":")[1];

      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${productName}`,
      });
    }

    if (error.message.startsWith("STOCK_UPDATE_FAILED:")) {
      const productName = error.message.split(":")[1];

      return res.status(400).json({
        success: false,
        message:
          `Stock changed before the order could be completed for ${productName}. ` +
          "Please try again.",
      });
    }

    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  } finally {
    await session.endSession();
  }
};

export const getPendingPaymentOrder = async (req, res) => {
  const order = await Order.findOne({
    user: req.user._id,
    paymentStatus: "pending",
    orderStatus: "pending",
  }).sort({ createdAt: -1 });

  if (!order) {
    return res.status(200).json({
      success: true,
      data: { order: null },
    });
  }

  // Backward compatibility for orders created before the reservation
  // fields existed in the schema. Only revive a fresh pending order.
  if (order.inventoryReserved === undefined) {
    const expiresAt = new Date(
      order.createdAt.getTime() + 15 * 60 * 1000
    );

    if (expiresAt <= new Date()) {
      return res.status(200).json({
        success: true,
        data: { order: null },
      });
    }

    order.inventoryReserved = true;
    order.paymentExpiresAt = expiresAt;
    await order.save();
  }

  if (
    !order.inventoryReserved ||
    (order.paymentExpiresAt && order.paymentExpiresAt <= new Date())
  ) {
    return res.status(200).json({
      success: true,
      data: { order: null },
    });
  }

  return res.status(200).json({
    success: true,
    data: { order },
  });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name slug")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
};

export const getAdminOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name slug");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!allowedTransitions[order.orderStatus].includes(status)) {
    return res.status(400).json({
      success: false,
      message:
        `Cannot change order status from "${order.orderStatus}" to "${status}"`,
    });
  }

  if (status === "confirmed" && order.paymentStatus !== "paid") {
    return res.status(400).json({
      success: false,
      message: "Only paid orders can be confirmed",
    });
  }

  if (status === "cancelled" && order.inventoryReserved) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const currentOrder = await Order.findById(req.params.id).session(session);

        if (!currentOrder) {
          throw new Error("ORDER_NOT_FOUND");
        }

        if (currentOrder.inventoryReserved) {
          for (const item of currentOrder.items) {
            const result = await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session }
            );

            if (result.modifiedCount !== 1) {
              throw new Error(`STOCK_RESTORE_FAILED:${item.name}`);
            }
          }

          currentOrder.inventoryReserved = false;
        }

        currentOrder.orderStatus = "cancelled";
        currentOrder.paymentExpiresAt = null;
        await currentOrder.save({ session });
      });
    } catch (error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (error.message.startsWith("STOCK_RESTORE_FAILED:")) {
        return res.status(500).json({
          success: false,
          message: "Failed to restore product stock",
        });
      }

      throw error;
    } finally {
      await session.endSession();
    }
  } else {
    order.orderStatus = status;
    if (status !== "pending") {
      order.paymentExpiresAt = null;
    }
    await order.save();
  }

  const updatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("items.product", "name slug");

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: {
      order: updatedOrder,
    },
  });
};

export const cancelMyOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).session(session);

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const cancellableStatuses = ["pending"];

      if (!cancellableStatuses.includes(order.orderStatus)) {
        throw new Error(
          `CANNOT_CANCEL:${order.orderStatus}`
        );
      }
      
      if (order.paymentStatus === "paid") {
        throw new Error("PAID_ORDER_CANNOT_CANCEL");
      }

      // Only restore stock if this order still has a reservation.
      if (order.inventoryReserved) {
        for (const item of order.items) {
          const result = await Product.updateOne(
            {
              _id: item.product,
            },
            {
              $inc: {
                stock: item.quantity,
              },
            },
            { session }
          );

          if (result.modifiedCount !== 1) {
            throw new Error(
              `STOCK_RESTORE_FAILED:${item.name}`
            );
          }
        }

        order.inventoryReserved = false;
      }

      order.orderStatus = "cancelled";
      order.paymentExpiresAt = null;

      await order.save({ session });
    });

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully and stock restored",
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (error.message === "PAID_ORDER_CANNOT_CANCEL") {
        return res.status(400).json({
          success: false,
          message:
            "Paid orders cannot be cancelled until refund processing is available",
        });
      }
      
      if (error.message.startsWith("CANNOT_CANCEL:")) {
        const status = error.message.split(":")[1];
      
        return res.status(400).json({
          success: false,
          message:
            `Order cannot be cancelled after it reaches "${status}" status`,
        });
      }

    if (error.message.startsWith("STOCK_RESTORE_FAILED:")) {
      return res.status(500).json({
        success: false,
        message: "Failed to restore product stock",
      });
    }

    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  } finally {
    await session.endSession();
  }
};