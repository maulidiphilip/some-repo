import { Router } from "express";
import * as ticketTypesController from "../controllers/ticketTypes.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createTicketTypeSchema,
  ticketTypeIdParamSchema,
  updateTicketTypeSchema,
} from "../schemas/ticketTypes.schema";

// mergeParams so nested router can read :eventId from the parent events router
export const ticketTypesRouter = Router({ mergeParams: true });

ticketTypesRouter.get("/", validate(ticketTypeIdParamSchema, "params"), ticketTypesController.list);

ticketTypesRouter.post(
  "/",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  validate(ticketTypeIdParamSchema, "params"),
  validate(createTicketTypeSchema),
  ticketTypesController.create
);

ticketTypesRouter.patch(
  "/:ticketTypeId",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  validate(ticketTypeIdParamSchema, "params"),
  validate(updateTicketTypeSchema),
  ticketTypesController.update
);

ticketTypesRouter.delete(
  "/:ticketTypeId",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  validate(ticketTypeIdParamSchema, "params"),
  ticketTypesController.remove
);
