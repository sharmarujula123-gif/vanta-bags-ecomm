import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({
    user: req.user._id,
  }).populate({
    path: "items.product",
    select:
      "name slug price compareAtPrice images stock isActive",
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      cart,
    },
  });
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive integer",
    });
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} item(s) available`,
    });
  }

  let cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: product._id,
          quantity,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) available`,
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
      });
    }

    await cart.save();
  }

  await cart.populate({
    path: "items.product",
    select:
      "name slug price compareAtPrice images stock isActive",
  });

  return res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: {
      cart,
    },
  });
};
export const updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
  
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }
  
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available`,
      });
    }
  
    const cart = await Cart.findOne({
      user: req.user._id,
    });
  
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
  
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
  
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }
  
    item.quantity = quantity;
  
    await cart.save();
  
    await cart.populate({
      path: "items.product",
      select:
        "name slug price compareAtPrice images stock isActive",
    });
  
    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: {
        cart,
      },
    });
  };
  export const removeCartItem = async (req, res) => {
    const { productId } = req.params;
  
    const cart = await Cart.findOne({
      user: req.user._id,
    });
  
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
  
    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );
  
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }
  
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
  
    await cart.save();
  
    await cart.populate({
      path: "items.product",
      select:
        "name slug price compareAtPrice images stock isActive",
    });
  
    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: {
        cart,
      },
    });
  };
  export const clearCart = async (req, res) => {
    const cart = await Cart.findOne({
      user: req.user._id,
    });
  
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
  
    cart.items = [];
  
    await cart.save();
  
    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        cart,
      },
    });
  };