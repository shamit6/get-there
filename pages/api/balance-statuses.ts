// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, BalanceStatus } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceStatus | null>
  ) {
    try {
      await prisma.$connect()
      let response: BalanceStatus | null;
      if (req.method === 'GET') {
        response = await prisma.balanceStatus.findFirst();
      } else if (req.method === 'PUT') {
        const { amount } = req.body
        response = await prisma.balanceStatus.create({
          data: {
            amount: Number(amount),
          },
        });
      }
 
      res.status(200).json(response!)
    } catch (e) {
      res.status(500).send(e.message)
    } finally {
      await prisma.$disconnect()
    }
}
