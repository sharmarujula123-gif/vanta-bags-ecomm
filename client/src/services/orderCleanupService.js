import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const cleanupExpiredOrders = async () => {
  const expiredOrders = await Order.find({
    paymentStatus: "pending",
    orderStatus: "pending",
    inventoryReserved: true,
    paymentExpiresAt: {
      $ne: null,
      $lt: new Date(),
    },
  });

  for (const order of expiredOrders) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const currentOrder = await Order.findOne({
          _id: order._id,
          paymentStatus: "pending",
          orderStatus: "pending",
          inventoryReserved: true,
        }).session(session);

        if (!currentOrder) {
          return;
        }

        for (const item of currentOrder.items) {
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
              `Failed to restore stock for ${item.name}`
            );
          }
        }

        currentOrder.inventoryReserved = false;
currentOrder.paymentStatus = "failed";
currentOrder.orderStatus = "cancelled";
currentOrder.paymentExpiresAt = null;

        await currentOrder.save({ session });
      });

      console.log(
        `Expired order cleaned up: ${order._id}`
      );
    } catch (error) {
      console.error(
        `Failed to clean expired order ${order._id}:`,
        error.message
      );
    } finally {
      await session.endSession();
    }
  }
};