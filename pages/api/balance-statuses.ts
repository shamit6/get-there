import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { BalanceStatus, prismaClient } from '../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceStatus | {}>
) {
  const session = await getSession({ req })
  const userEmail = session?.user?.email

  if (!userEmail) {
    return res.status(401).send({})
  }

  try {
    await prismaClient.$connect()
    let response: BalanceStatus[]
    if (req.method === 'GET') {
      const userBlanceStatuses = await prismaClient.balanceStatus.findMany({
        where: { userEmail },
        orderBy: [{ createdAt: 'asc' }],
        take: req.query.last ? 1 : undefined,
      })
      response = userBlanceStatuses
    } else if (req.method === 'PUT') {
      const { amount } = req.body

      response = [
        await prismaClient.balanceStatus.create({
          data: {
            userEmail: session?.user?.email!,
            amount: Number(amount),
          },
        }),
      ]
    }

    res.status(200).json(response!)
  } catch (e) {
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
