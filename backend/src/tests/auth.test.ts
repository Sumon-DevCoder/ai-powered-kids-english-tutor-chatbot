import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app";
import { seedDefaultParent, DEFAULT_DEMO_PARENT } from "../modules/auth/user.model";

describe("Parent Authentication & Security Layer", () => {
  beforeAll(async () => {
    await seedDefaultParent();
  });

  it("should successfully log in with demo credentials and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: DEFAULT_DEMO_PARENT.email,
        password: DEFAULT_DEMO_PARENT.passwordPlain,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(DEFAULT_DEMO_PARENT.email);
    expect(res.body.data.user.role).toBe("parent");
  });

  it("should reject login with incorrect password and return 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: DEFAULT_DEMO_PARENT.email,
        password: "wrongpassword999",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject registration with invalid email format", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test Parent",
        email: "not-an-email",
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should deny access to protected analytics without a Bearer token", async () => {
    const res = await request(app).get("/api/v1/analytics/metrics");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should allow access to protected analytics with a valid Bearer token", async () => {
    // 1. Log in to get token
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: DEFAULT_DEMO_PARENT.email,
        password: DEFAULT_DEMO_PARENT.passwordPlain,
      });

    const token = loginRes.body.data.token;

    // 2. Fetch protected metrics with token
    const metricsRes = await request(app)
      .get("/api/v1/analytics/metrics")
      .set("Authorization", `Bearer ${token}`);

    expect(metricsRes.status).toBe(200);
    expect(metricsRes.body.success).toBe(true);
    expect(metricsRes.body.data.performance.latencySub2sRate).toBe("100%");
  });
});
