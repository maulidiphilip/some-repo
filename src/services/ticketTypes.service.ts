import { prisma } from "../lib/prisma";
import { ApiError } from "../middleware/error.middleware";
import { CreateTicketTypeInput, UpdateTicketTypeInput } from "../schemas/ticketTypes.schema";

export function listTicketTypes(eventId: string) {
  return prisma.ticketType.findMany({ where: { eventId } });
}

export async function getTicketTypeById(id: string) {
  const ticketType = await prisma.ticketType.findUnique({ where: { id } });

  if (!ticketType) {
    throw new ApiError(404, "Ticket type not found");
  }

  return ticketType;
}

export async function createTicketType(eventId: string, data: CreateTicketTypeInput) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return prisma.ticketType.create({
    data: { ...data, eventId },
  });
}

export async function updateTicketType(id: string, data: UpdateTicketTypeInput) {
  await getTicketTypeById(id); // 404s if missing
  return prisma.ticketType.update({ where: { id }, data });
}

export async function deleteTicketType(id: string) {
  await getTicketTypeById(id); // 404s if missing
  await prisma.ticketType.delete({ where: { id } });
}
