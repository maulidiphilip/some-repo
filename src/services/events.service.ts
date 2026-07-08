import { prisma } from "../lib/prisma";
import { ApiError } from "../middleware/error.middleware";
import { CreateEventInput, UpdateEventInput } from "../schemas/events.schema";

export function listEvents() {
  return prisma.event.findMany({
    orderBy: { startsAt: "asc" },
    include: { ticketTypes: true },
  });
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { ticketTypes: true },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
}

export function createEvent(data: CreateEventInput, organizerId: string) {
  return prisma.event.create({
    data: { ...data, organizerId },
  });
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  await getEventById(id); // 404s if missing
  return prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id: string) {
  await getEventById(id); // 404s if missing
  await prisma.event.delete({ where: { id } });
}
