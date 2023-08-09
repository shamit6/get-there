import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../utils/prisma'
import type { TransactionConfig } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransactionConfig | TransactionConfig[]>
) {
  const session = await getSession({ req })
  const userEmail = session?.user?.email

  if (!userEmail) {
    return res.status(401).send([])
  }

  try {
    await prismaClient.$connect()
    let response: TransactionConfig | TransactionConfig[]
    if (req.method === 'GET') {
      response = await prismaClient.transactionConfig.findMany({
        where: { userEmail },
      })
    } else {
      response = await prismaClient.transactionConfig.create({
        data: { ...req.body, userEmail },
      })
    }

    res.status(200).json(response!)
  } catch (e: any) {
    console.error(e)
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
