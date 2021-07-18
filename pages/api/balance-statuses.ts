// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BalanceStatus, prismaClient } from '../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceStatus | {}>
  ) {
    try {
      await prismaClient.$connect()
      let response: BalanceStatus | {};
      if (req.method === 'GET') {
        response = await prismaClient.balanceStatus.findFirst() || {};
      } else if (req.method === 'PUT') {
        const { amount } = req.body

        response = await prismaClient.balanceStatus.create({
          data: {
            amount: Number(amount),
          },
        });
      }
 
      res.status(200).json(response!)
    } catch (e) {
      res.status(500).send(e.message)
    } finally {
      await prismaClient.$disconnect()
    }
}
