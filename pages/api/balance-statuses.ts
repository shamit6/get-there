// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, BalanceStatus } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceStatus>
  ) {
    try {
      await prisma.$connect()
      console.log('req.body', req.body);
      
      const { amount } = req.body
      const respose = await prisma.balanceStatus.create({
        data: {
          amount,
        },
      })
      console.log(respose);
      res.status(200).json(respose)
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await prisma.$disconnect()
    }
}
