import { PrismaClient } from '@prisma/client'
export type { BalanceStatus } from '@prisma/client'

export const prismaClient = new PrismaClient()
