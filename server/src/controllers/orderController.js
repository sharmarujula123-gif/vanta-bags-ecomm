import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

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
  
        cart.items = [];
        await cart.save({ session });
  
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
          message: "One or more products in your cart are unavailable",
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
          message: `Stock changed before the order could be completed for ${productName}. Please try again.`,
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