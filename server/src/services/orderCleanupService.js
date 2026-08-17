import Order from "../models/order.js";
import Product from "../models/product.js";

export const cleanupExpiredOrders = async () => {
  try {
    const expiredOrders = await Order.find({
      paymentStatus: "pending",
      orderStatus: "pending",
      inventoryReserved: true,
      paymentExpiresAt: {
        $lte: new Date(),
      },
    });

    if (expiredOrders.length === 0) {
      return;
    }

    for (const order of expiredOrders) {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }

      order.inventoryReserved = false;
      order.paymentExpiresAt = null;
      order.orderStatus = "cancelled";

      await order.save();
    }

    console.log(
      `Cleaned up ${expiredOrders.length} expired order(s)`
    );
  } catch (error) {
    console.error(
      "Order cleanup error:",
      error
    );
  }
};