import { Asset } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from 'utils/auth'
import { prismaClient } from 'utils/prisma'

export async function getAssets(): Promise<Asset[]> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    return []
  }

  return await prismaClient.asset.findMany({
    where: { userEmail },
    orderBy: [{ cashValueDate: 'desc' }],
  })
}

export async function createAsset(asset: Asset): Promise<Asset> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  return await prismaClient.asset.create({
    data: { ...asset, userEmail },
  })
}

export async function deleteAsset(assetId: string): Promise<Asset> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  return await prismaClient.asset.delete({
    where: { id: assetId },
  })
}

export async function updateAsset(asset: Asset): Promise<Asset> {
  const session = await getServerSession(nextAuthOptions)

  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error('Unauthorized')
  }

  const { id, ...rest } = asset
  return await prismaClient.asset.update({
    where: { id, userEmail },
    data: { ...rest },
  })
}
