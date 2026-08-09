import express from "express";

import {
  createAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  createAddress
);

router.get(
  "/",
  authenticateUser,
  getMyAddresses
);

router.get(
  "/:id",
  authenticateUser,
  getAddressById
);

router.patch(
  "/:id",
  authenticateUser,
  updateAddress
);

router.delete(
  "/:id",
  authenticateUser,
  deleteAddress
);

router.patch(
  "/:id/default",
  authenticateUser,
  setDefaultAddress
);

export default router;