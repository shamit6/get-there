import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../utils/prisma'
import { Mortgage } from 'utils/types'
import { log } from 'console'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Mortgage>
) {
  const session = await getSession({ req })
  const userEmail = session?.user?.email

  if (!userEmail) {
    return res.status(401).send([])
  }

  try {
    const response = await prismaClient.$transaction(async (prisma) => {
      const reqMortgage = req.body as Mortgage

      const { courses, ...reqMortgageRest } = reqMortgage

      const mortgage = await prisma.mortgage.create({
        data: { ...reqMortgageRest, userEmail },
      })
      
      await prisma.mortgageCourse.createMany({
        data: courses.map(course => ({ ...course, mortgageId: mortgage.id, userEmail })),
      })

      return await prisma.mortgage.findUnique({where: { id: mortgage.id },})
    })

    res.status(200).json(response! as unknown as Mortgage)
  } catch (e) {
    console.error(e)
    res.status(500).send(e.message)
  } finally {
    await prismaClient.$disconnect()
  }
}
