import express from "express";

import {
  createAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "../validators/addressValidator.js";

import authenticateUser from "../middleware/authenticateUser.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    validate(createAddressSchema),
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
    validate(updateAddressSchema),
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