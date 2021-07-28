import { getSession } from 'next-auth/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient, TransactionConfig } from '../../../utils/prisma'
import { addAbortSignal } from 'stream'

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
    return res.status(401)
  }

  try {
    await prismaClient.$connect()
    let response: TransactionConfig | null = null
    if (method === 'GET') {
      response = await prismaClient.transactionConfig.findUnique({
        where: { id: id as string },
      })
    } else if (method === 'PUT') {
      const a = await prismaClient.transactionConfig.findUnique({where: {id: id as string }})

      response = await prismaClient.transactionConfig.update({
        where: { id: id as string},
        data: body,
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
