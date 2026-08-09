import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters"),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),

    addressLine1: z
      .string()
      .trim()
      .min(5, "Address is too short"),

    addressLine2: z
      .string()
      .trim()
      .optional()
      .default(""),

    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    state: z
      .string()
      .trim()
      .min(2, "State is required"),

    postalCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Postal code must contain 6 digits"),

    country: z
      .string()
      .trim()
      .default("India"),

    isDefault: z
      .boolean()
      .optional()
      .default(false),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateAddressSchema = z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .optional(),
  
      phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
        .optional(),
  
      addressLine1: z
        .string()
        .trim()
        .min(5)
        .optional(),
  
      addressLine2: z
        .string()
        .trim()
        .optional(),
  
      city: z
        .string()
        .trim()
        .min(2)
        .optional(),
  
      state: z
        .string()
        .trim()
        .min(2)
        .optional(),
  
      postalCode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Invalid postal code")
        .optional(),
  
      country: z
        .string()
        .trim()
        .optional(),
  
      isDefault: z
        .boolean()
        .optional(),
    }),
  
    params: z.object({}),
  
    query: z.object({}),
  });