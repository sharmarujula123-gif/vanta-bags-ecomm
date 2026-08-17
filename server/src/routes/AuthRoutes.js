import express from "express";

import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/authController.js";

import authenticateUser from "../middleware/authenticateUser.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { authLimiter } from "../middleware/rateLimiter.js";

console.log("🔥 AUTH ROUTES LOADED");

const router = express.Router();

router.post("/register",authLimiter, register);
router.post("/login", authLimiter,login);
router.post("/logout", logout);
router.post("/refresh",authLimiter, refreshToken);

router.get("/me", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
});

router.get(
    "/admin-test",
    authenticateUser,
    requireAdmin,
    (req, res) => {
      res.status(200).json({
        success: true,
        message: "Welcome Admin",
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    }
  );
export default router;