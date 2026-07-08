import { Router } from "express";
import { eventsRouter } from "./events.routes";
import { ticketTypesRouter } from "./ticketTypes.routes";
import { ordersRouter } from "./orders.routes";
import { authRouter } from "./auth.routes"; // your existing auth routes

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/events/:eventId/ticket-types", ticketTypesRouter);
apiRouter.use("/orders", ordersRouter);
