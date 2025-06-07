import {PrismaClient, Prisma} from "@/lib/generated/prisma"

export const prisma = new PrismaClient();
export type { Prisma };