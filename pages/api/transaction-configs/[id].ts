import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from 'utils/prisma'
import type { TransactionConfig } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransactionConfig | null>
) {
  const session = await getServerSession(req, res, nextAuthOptions)
  const userEmail = session?.user?.email

  const {
    query: { id },
    method,
    body,
  } = req
  if (!userEmail) {
    return res.status(401).send(null)
  }

  try {
    await prismaClient.$connect()
    let response: TransactionConfig | null = null
    if (method === 'GET') {
      response = await prismaClient.transactionConfig.findUnique({
        where: { id: id as string },
      })
    } else if (method === 'PUT') {
      response = await prismaClient.transactionConfig.update({
        where: { id: id as string },
        data: {
          ...body,
          timePeriod: !body.timePeriod ? null : body.timePeriod,
          periodAmount: !body.periodAmount ? null : Number(body.periodAmount),
          endDate: !body.endDate ? null : body.endDate,
        },
      })
    } else if (method === 'DELETE') {
      response = await prismaClient.transactionConfig.delete({
        where: { id: id as string },
      })
    }

    res.status(200).json(response)
  } catch (e: any) {
    console.error(e)
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
