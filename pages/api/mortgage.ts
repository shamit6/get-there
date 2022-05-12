import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../utils/prisma'
import { Mortgage as PersistedMortgage } from '@prisma/client'
import { Mortgage } from '../../utils/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PersistedMortgage | Error>
) {
  const session = await getSession({ req })
  const userEmail = session?.user?.email

  if (!userEmail) {
    return res.status(401).send(new Error('User not logged-in'))
  }

  try {
    await prismaClient.$connect()
    if (req.method !== 'PUT') {
      throw new Error('method not supported in mortgage API')
    }
    // let response: BalanceStatus[]
    // if (req.method === 'GET') {
    //   const userBlanceStatuses = await prismaClient.balanceStatus.findMany({
    //     where: { userEmail },
    //     orderBy: [{ createdAt: 'asc' }],
    //     take: req.query.last ? 1 : undefined,
    //   })
    //   response = userBlanceStatuses
    // } else if (req.method === 'PUT') {
    const mortgage = req.body as Mortgage
    console.log({ mortgage })

    // const persistedMortgage = await prismaClient.mortgage.upsert({
    //   where: { userEmail },
    //   create: mortgage,
    //   update: mortgage,
    // })

    //   response = [
    //     await prismaClient.balanceStatus.create({
    //       data: {
    //         userEmail: session?.user?.email!,
    //         amount: Number(amount),
    //       },
    //     }),
    //   ]
    // }

    // res.status(200).json(persistedMortgage)
    throw new Error('not implemented')
  } catch (e) {
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
