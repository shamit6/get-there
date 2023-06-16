import { TransactionConfig } from '@prisma/client'
import { prismaClient } from 'utils/prisma'

export async function getTransactionConfigs(userEmail: string) {
  try {
    await prismaClient.$connect()

    const transactions = await prismaClient.transactionConfig.findMany({
      where: { userEmail },
    })
    return transactions
  } finally {
    await prismaClient.$disconnect()
  }
}

export async function createTransactionConfig(
  transactionConfig: TransactionConfig
) {
  try {
    await prismaClient.$connect()

    const response = await prismaClient.transactionConfig.create({
      data: {
        ...transactionConfig,
      },
    })
    return response
  } finally {
    await prismaClient.$disconnect()
  }
}
