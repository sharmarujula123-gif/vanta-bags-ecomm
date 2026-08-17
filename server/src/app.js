import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { corsOptions } from "./config/cors.js";
import { registerRoutes } from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));

// Razorpay webhook needs the raw request body before express.json().
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Vanta Bags API is running",
  });
});

registerRoutes(app);

// Error handler must remain last.
app.use(errorHandler);

export default app;
