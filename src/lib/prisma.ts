import { PrismaClient } from "@prisma/client";

// Prevents multiple PrismaClient instances in dev (hot-reload) and in tests.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
