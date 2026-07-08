import { prisma } from "../src/lib/prisma";

// Wipe tables between test files. Order matters due to FK constraints.
export async function resetDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
}

afterAll(async () => {
  await prisma.$disconnect();
});
