// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BalanceStatus, prismaClient } from '../../utils/prisma'
import _ from 'lodash'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceStatus | {}>
) {
  try {
    await prismaClient.$connect()
    let response: BalanceStatus | {}
    if (req.method === 'GET') {
      const userBlanceStatuses = await prismaClient.balanceStatus.findMany({})
      if (req.query.last) {
        response = _.maxBy(userBlanceStatuses, 'createdAt') || {}
      } else {
        response = userBlanceStatuses
      }
    } else if (req.method === 'PUT') {
      const { amount } = req.body

      response = await prismaClient.balanceStatus.create({
        data: {
          amount: Number(amount),
        },
      })
    }

    res.status(200).json(response!)
  } catch (e) {
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
