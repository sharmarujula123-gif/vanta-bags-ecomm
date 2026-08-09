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

  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Your cart is empty",
    });
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        message: "One or more products in your cart are unavailable",
      });
    }

    if (item.quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}`,
      });
    }

    const itemTotal = product.price * item.quantity;

    subtotal += itemTotal;

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

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    subtotal,
    shippingFee,
    total,
  });

  // Deduct stock after order creation
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // Empty cart
  cart.items = [];
  await cart.save();

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: {
      order,
    },
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