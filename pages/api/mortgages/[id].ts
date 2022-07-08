import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../utils/prisma'
import { Mortgage } from 'utils/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Mortgage | null>
) {
  const session = await getSession({ req })
  const userEmail = session?.user?.email

  if (!userEmail) {
    return res.status(401).send(null)
  }
  const {
    query: { id },
    method,
    body,
  } = req

  try {
    if (method === 'GET') {
      await prismaClient.$connect()
      const mortgage = await prismaClient.mortgage.findUnique({
        where: { id: id as string },
        include: {
          courses: true,
        },
      })

      if (mortgage?.userEmail !== userEmail) {
        throw new Error('Mortgage not found')
      }

      res.status(200).json(mortgage)
    } else if (method === 'PUT') {
      const response = await prismaClient.$transaction(
        async (prisma) => {
          const { courses, ...reqMortgageRest } = body as Mortgage

          const { count } = await prisma.mortgage.updateMany({
            where: { id: id as string, userEmail },
            data: { ...reqMortgageRest, userEmail },
          })

          if (count === 0) {
            throw new Error('Mortgage not found')
          }

          await prisma.mortgageCourse.deleteMany({
            where: { mortgageId: id as string, userEmail },
          })

          await prisma.mortgageCourse.createMany({
            data: courses.map((course) => ({
              ...course,
              mortgageId: id as string,
              userEmail,
            })),
          })

          return await prisma.mortgage.findUnique({
            where: { id: id as string },
            include: {
              courses: true,
            },
          })
        },
        { timeout: 10000 }
      )

      res.status(200).json(response as Mortgage)
    } else if (method === 'DELETE') {
      await prismaClient.$transaction(
        async (prisma) => {
          const { count } = await prismaClient.mortgage.deleteMany({
            where: { userEmail, id: id as string },
          })

          if (count === 0) {
            throw new Error('Mortgage not found')
          }

          await prisma.mortgageCourse.deleteMany({
            where: { mortgageId: id as string, userEmail },
          })

          await prisma.mortgageCourse.deleteMany({
            where: { mortgageId: id as string, userEmail },
          })
        },
        { timeout: 10000 }
      )

      res.status(200)
    }
  } catch (e) {
    if (e.message === 'Mortgage not found') {
      res.status(404).send(e.message)
    } else {
      console.error(e)
      res.status(500).send(e.message)
    }
  } finally {
    await prismaClient.$disconnect()
  }
}
