
import { prismaClient } from 'utils/prisma'

export async function getBalanceStatuses(userEmail: string, last?: boolean) {
  try {
    await prismaClient.$connect()

    const userBalanceStatuses = await prismaClient.balanceStatus.findMany({
      where: { userEmail },
      orderBy: [{ createdAt: 'desc' }],
      take: last ? 1 : undefined,
    })
    return userBalanceStatuses
  } finally {
    await prismaClient.$disconnect()
  }
}

export async function createBalanceStatus(userEmail: string, amount: number) {
  try {
    await prismaClient.$connect()

    const response = await prismaClient.balanceStatus.create({
      data: {
        userEmail,
        amount,
      },
    })
    return response
  } finally {
    await prismaClient.$disconnect()
  }
}