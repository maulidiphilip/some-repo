import { z } from "zod";

const eventShape = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(5000).optional(),
  venue: z.string().min(2).max(200),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
});

export const createEventSchema = eventShape.refine(
  (data) => data.endsAt > data.startsAt,
  { message: "endsAt must be after startsAt", path: ["endsAt"] }
);

// .partial() runs on the plain object shape (no refinement attached yet),
// then the same endsAt > startsAt check is re-applied - but only when both
// dates are actually present in the patch, since a partial update might
// only touch one of them.
export const updateEventSchema = eventShape.partial().refine(
  (data) => {
    if (data.startsAt && data.endsAt) {
      return data.endsAt > data.startsAt;
    }
    return true;
  },
  { message: "endsAt must be after startsAt", path: ["endsAt"] }
);

export const eventIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;