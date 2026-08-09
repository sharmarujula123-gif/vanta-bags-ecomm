import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../app.js";

describe("Order API", () => {
  it("should reject order creation without authentication", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        shippingAddress: {
          name: "Test User",
          phone: "9876543210",
          addressLine1: "Test Address",
          city: "Delhi",
          state: "Delhi",
          postalCode: "110001",
          country: "India",
        },
      });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});