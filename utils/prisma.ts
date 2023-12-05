import { PrismaClient } from '@prisma/client'
const g: typeof globalThis & { __prisma?: PrismaClient } = globalThis

export const prismaClient = g.__prisma ?? new PrismaClient()

g.__prisma = prismaClient
