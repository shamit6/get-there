'use server'
import { Stock } from 'utils/types'
import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'
import { prismaClient } from 'utils/prisma'

export async function getStocks(): Promise<Stock[]> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    return []
  }

  try {
    const stocks = await prismaClient.stock.findMany({
      where: { userEmail },
    })
    return stocks.map((stock) => ({
      ...stock,
      stockBuyDate: new Date(stock.stockBuyDate),
    }))
  } finally {
  }
}
