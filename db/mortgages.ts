import { Mortgage as PrismaMortgage } from '@prisma/client'
import { Mortgage } from 'utils/types'
import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'
import { prismaClient } from 'utils/prisma'

export async function getMortgages(): Promise<Mortgage[]> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    return []
  }

  try {
    const mortgages = await prismaClient.mortgage.findMany({
      where: { userEmail },
      include: {
        courses: true,
      },
    })
    return mortgages as Mortgage[]
  } finally {
  }
}

export async function createMortgage(
  mortgageToCreate: Mortgage
): Promise<PrismaMortgage> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  try {
    const response = await prismaClient.$transaction(async (prisma) => {
      const { courses, ...reqMortgageRest } = mortgageToCreate

      const mortgage = await prisma.mortgage.create({
        data: { ...reqMortgageRest, userEmail },
      })

      await prisma.mortgageCourse.createMany({
        data: courses.map((course) => ({
          ...course,
          mortgageId: mortgage.id,
          userEmail,
        })),
      })

      return await prisma.mortgage.findUnique({ where: { id: mortgage.id } })
    })
    return response!
  } finally {
  }
}

export async function deleteMortgage(mortgageId: string): Promise<void> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  await prismaClient.$transaction(
    async (prisma) => {
      const { count } = await prisma.mortgage.deleteMany({
        where: { id: mortgageId, userEmail },
      })

      if (count === 0) {
        throw new Error('Mortgage not found')
      }

      await prisma.mortgageCourse.deleteMany({
        where: { mortgageId },
      })
    },
    { timeout: 10000 }
  )
}

export async function updateMortgage(
  mortgageToUpdate: Mortgage
): Promise<Mortgage> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  try {
    const response = await prismaClient.$transaction(
      async (prisma) => {
        const { courses, ...reqMortgageRest } = mortgageToUpdate

        await prisma.mortgageCourse.deleteMany({
          where: { mortgageId: mortgageToUpdate.id as string, userEmail },
        })

        await prisma.mortgageCourse.createMany({
          data: courses.map((course) => ({
            ...course,
            mortgageId: mortgageToUpdate.id as string,
            userEmail,
          })),
        })

        return await prisma.mortgage.findUnique({
          where: { id: mortgageToUpdate.id as string },
          include: {
            courses: true,
          },
        })
      },
      { timeout: 10000 }
    )

    return response as Mortgage
  } finally {
  }
}
