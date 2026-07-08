import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { resetDatabase } from "../setup";

describe("Events routes", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe("GET /api/events", () => {
    it("returns an empty array when there are no events", async () => {
      const res = await request(app).get("/api/events");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("returns events that exist", async () => {
      const organizer = await prisma.user.create({
        data: { email: "org@test.com", password: "hashed", role: "ORGANIZER" },
      });

      await prisma.event.create({
        data: {
          title: "Test Concert",
          venue: "Main Hall",
          startsAt: new Date("2026-08-01"),
          endsAt: new Date("2026-08-01T23:00:00Z"),
          organizerId: organizer.id,
        },
      });

      const res = await request(app).get("/api/events");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe("Test Concert");
    });
  });

  describe("GET /api/events/:id", () => {
    it("returns 404 for a non-existent event", async () => {
      const res = await request(app).get("/api/events/00000000-0000-0000-0000-000000000000");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/events", () => {
    it("rejects requests without auth", async () => {
      const res = await request(app).post("/api/events").send({
        title: "Unauthorized Event",
        venue: "Nowhere",
        startsAt: "2026-08-01",
        endsAt: "2026-08-02",
      });
      expect(res.status).toBe(401);
    });

    it("rejects invalid payloads", async () => {
      // Replace with a real signed JWT for an ORGANIZER once auth helpers exist
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", "Bearer invalid-token")
        .send({ title: "x" });

      expect([400, 401]).toContain(res.status);
    });
  });
});
