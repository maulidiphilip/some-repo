import request from "supertest";
import { app } from "../../src/app";
import { resetDatabase } from "../setup";

// Never hit real Stripe in CI - mock the client entirely.
jest.mock("../../src/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: "cs_test_123",
          url: "https://checkout.stripe.com/test",
        }),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

describe("Orders routes", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("rejects order creation without auth", async () => {
    const res = await request(app).post("/api/orders").send({
      items: [{ ticketTypeId: "00000000-0000-0000-0000-000000000000", quantity: 1 }],
    });

    expect(res.status).toBe(401);
  });

  // Add an authenticated happy-path test once you wire up a real JWT test helper:
  // it("creates a pending order + Stripe checkout session", async () => { ... });
});
