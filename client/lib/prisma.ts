import { PrismaClient } from "@prisma/client";

/**
 * @description Singleton de Prisma Client.
 * En desarrollo se cachea en globalThis para evitar múltiples instancias con hot reload.
 * En producción se crea una sola instancia. Logs de query solo en desarrollo.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}