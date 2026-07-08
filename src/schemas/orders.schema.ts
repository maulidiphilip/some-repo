import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        ticketTypeId: z.string().uuid(),
        quantity: z.number().int().positive().max(20),
      })
    )
    .min(1),
});

export const orderIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
