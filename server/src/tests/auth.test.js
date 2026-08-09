import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../app.js";

describe("Auth API", () => {
  it("should reject registration when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject login when credentials are missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });
});