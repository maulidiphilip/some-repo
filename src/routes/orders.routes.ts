import { Router } from "express";
import * as ordersController from "../controllers/orders.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema, orderIdParamSchema } from "../schemas/orders.schema";

export const ordersRouter = Router();

ordersRouter.use(requireAuth); // every order route requires a logged-in user

ordersRouter.get("/", ordersController.list);
ordersRouter.get("/:id", validate(orderIdParamSchema, "params"), ordersController.getOne);
ordersRouter.post("/", validate(createOrderSchema), ordersController.create);
