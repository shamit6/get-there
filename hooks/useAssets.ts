import { Asset } from '@prisma/client'
import { useCallback } from 'react'
import useSWR from 'swr'

function upsertToAssetsList(list: Asset[], asset: Asset) {
  if (!asset.id) {
    return [...list, asset]
  } else {
    const index = list.findIndex((t) => t.id === asset.id)
    if (index === -1) {
      return [...list, asset]
    } else {
      return [...list.slice(0, index), asset, ...list.slice(index + 1)]
    }
  }
}

export default function useAssets() {
  const { data: assets = [], mutate } = useSWR<Asset[]>('/api/assets')

  const deleteAsset = useCallback(
    async (assetId: string) => {
      await mutate(
        async () => {
          await fetch(`/api/assets/${assetId}`, { method: 'DELETE' })
          return assets.filter((a) => a.id !== assetId)
        },
        {
          populateCache: false,
          rollbackOnError: true,
          optimisticData: (assets: Asset[] = []) => {
            return assets?.filter((a) => a.id !== assetId)
          },
        }
      )
    },
    [mutate]
  )

  const upsertAsset = useCallback(
    async (asset: Partial<Asset>) => {
      await mutate(
        async () => {
          const { id, ...assetData } = asset
          const url = id ? `/api/assets/${id}` : '/api/assets'
          const res = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(assetData),
          })

          const newAsset = await res.json()

          return upsertToAssetsList(assets, newAsset)
        },
        {
          populateCache: false,
          rollbackOnError: true,
          optimisticData: () => {
            return upsertToAssetsList(assets, asset as Asset)
          },
        }
      )
    },
    [mutate]
  )

  return {
    assets,
    // error,
    // loading: !data && !error,
    deleteAsset,
    upsertAsset,
  }
}
