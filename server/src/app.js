import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(helmet());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL]
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
      ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow Postman/server-to-server requests
        if (!origin) {
          return callback(null, true);
        }
  
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
  
        return callback(
          new Error("Not allowed by CORS")
        );
      },
  
      credentials: true,
    })
  );

// Razorpay webhook needs the raw request body
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(
    express.json({
      limit: "1mb",
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "1mb",
    })
  );
app.use(cookieParser());

app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vanta Bags API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/reviews", reviewRoutes);

// MUST BE LAST
app.use(errorHandler);

export default app; 