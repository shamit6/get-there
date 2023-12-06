import { BalanceStatus } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'
import { prismaClient } from 'utils/prisma'

export async function getBalanceStatuses(): Promise<BalanceStatus[]> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    return []
  }

  return await prismaClient.balanceStatus.findMany({
    where: { userEmail },
    orderBy: [{ createdAt: 'desc' }],
  })
}

export async function createBalanceStatus(
  amount: number
): Promise<BalanceStatus> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  return await prismaClient.balanceStatus.create({
    data: {
      userEmail: userEmail,
      amount: Number(amount),
    },
  })
}
