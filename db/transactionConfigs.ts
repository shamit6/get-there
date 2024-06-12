'use server'
import { TransactionConfig } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from 'utils/auth'
import { prismaClient } from 'utils/prisma'
// import { TransactionConfig } from 'utils/types'

export async function getTransactionConfigs(): Promise<TransactionConfig[]> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    return []
  }

  try {
    // await prismaClient.$connect()
    const transactionconfigs = await prismaClient.transactionConfig.findMany({
      where: { userEmail },
    })
    return transactionconfigs as TransactionConfig[]
  } finally {
    // await prismaClient.$disconnect()
  }
}

export async function createTransactionConfig(
  transactionConfig: TransactionConfig
): Promise<TransactionConfig> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  try {
    // await prismaClient.$connect()
    const response = await prismaClient.transactionConfig.create({
      data: { ...transactionConfig, userEmail },
    })
    return response
  } finally {
    // await prismaClient.$disconnect()
  }
}

export async function deleteTransactionConfig(
  transactionConfigId: string
): Promise<TransactionConfig> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  try {
    // await prismaClient.$connect()
    const response = await prismaClient.transactionConfig.delete({
      where: { id: transactionConfigId },
    })
    return response
  } finally {
    // await prismaClient.$disconnect()
  }
}

export async function updateTransactionConfig(
  transactionConfig: TransactionConfig
): Promise<TransactionConfig> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  const { id, ...rest } = transactionConfig

  try {
    // await prismaClient.$connect()
    const response = await prismaClient.transactionConfig.update({
      where: { id },
      data: {
        ...rest,
        timePeriod: !rest.timePeriod ? null : rest.timePeriod,
        periodAmount: !rest.periodAmount ? null : Number(rest.periodAmount),
        endDate: !rest.endDate ? null : rest.endDate,
      },
    })
    return response
  } finally {
    // await prismaClient.$disconnect()
  }
}
