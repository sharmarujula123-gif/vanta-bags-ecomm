import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../app.js";

describe("Security", () => {
  it("should include security headers", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.headers["x-content-type-options"])
      .toBe("nosniff");

    expect(response.headers["x-frame-options"])
      .toBe("SAMEORIGIN");
  });

 
});