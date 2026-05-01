import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for Prisma persistence.");
  }

  if (global.__prismaClient) {
    return global.__prismaClient;
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    global.__prismaClient = client;
  }

  return client;
}
