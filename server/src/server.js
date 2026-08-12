import "dotenv/config";
import "./config/env.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import { cleanupExpiredOrders } from "./services/orderCleanupService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("Database connected");

    await cleanupExpiredOrders();

    setInterval(
      cleanupExpiredOrders,
      2 * 60 * 1000
    );

    app.listen(PORT, () => {
      console.log(
        `Vanta Bags API running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();