import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../app.js";

describe("Protected routes", () => {
  it("should reject /api/auth/me without authentication", async () => {
    const response = await request(app)
      .get("/api/auth/me");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject cart access without authentication", async () => {
    const response = await request(app)
      .get("/api/cart");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject address access without authentication", async () => {
    const response = await request(app)
      .get("/api/addresses");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});