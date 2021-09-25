import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient, TransactionConfig } from '../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransactionConfig | null>
) {
  const session = await getSession({ req })
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
        data: body,
      })
    } else if (method === 'DELETE') {
      response = await prismaClient.transactionConfig.delete({
        where: { id: id as string },
      })
    }

    res.status(200).json(response)
  } catch (e) {
    console.error(e)
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
