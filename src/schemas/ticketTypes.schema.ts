import { z } from "zod";

export const createTicketTypeSchema = z.object({
  name: z.string().min(2).max(100),
  priceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

export const updateTicketTypeSchema = createTicketTypeSchema.partial();

export const ticketTypeIdParamSchema = z.object({
  eventId: z.string().uuid(),
  ticketTypeId: z.string().uuid().optional(),
});

export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>;
export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>;
