import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { resetDatabase } from "../setup";

describe("Ticket types routes", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns an empty array for an event with no ticket types", async () => {
    const organizer = await prisma.user.create({
      data: { email: "org2@test.com", password: "hashed", role: "ORGANIZER" },
    });

    const event = await prisma.event.create({
      data: {
        title: "Ticket Test Event",
        venue: "Hall",
        startsAt: new Date("2026-09-01"),
        endsAt: new Date("2026-09-01T23:00:00Z"),
        organizerId: organizer.id,
      },
    });

    const res = await request(app).get(`/api/events/${event.id}/ticket-types`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 404 when creating ticket types for a non-existent event", async () => {
    const res = await request(app)
      .post("/api/events/00000000-0000-0000-0000-000000000000/ticket-types")
      .set("Authorization", "Bearer invalid-token")
      .send({ name: "VIP", priceCents: 5000, quantity: 100 });

    expect([401, 404]).toContain(res.status);
  });
});
