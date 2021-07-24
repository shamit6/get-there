import { PrismaClient } from '@prisma/client'
export type { BalanceStatus, User } from '@prisma/client'

export const prismaClient = new PrismaClient()
