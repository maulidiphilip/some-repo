import { Router } from "express";
import * as eventsController from "../controllers/events.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createEventSchema, eventIdParamSchema, updateEventSchema } from "../schemas/events.schema";

export const eventsRouter = Router();

eventsRouter.get("/", eventsController.list);
eventsRouter.get("/:id", validate(eventIdParamSchema, "params"), eventsController.getOne);

eventsRouter.post(
  "/",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  validate(createEventSchema),
  eventsController.create
);

eventsRouter.patch(
  "/:id",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  validate(eventIdParamSchema, "params"),
  validate(updateEventSchema),
  eventsController.update
);

eventsRouter.delete(
  "/:id",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  validate(eventIdParamSchema, "params"),
  eventsController.remove
);
