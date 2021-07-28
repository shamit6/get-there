import { PrismaClient } from '@prisma/client'
export type { BalanceStatus, User, TransactionConfig } from '@prisma/client'

export const prismaClient = new PrismaClient()
