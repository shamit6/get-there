'use client'
import AssetForm from 'components/AssetForm'
import useAssets from 'hooks/useAssets'

export default function Page({ params }: { params: { id: string } }) {
  const { assets } = useAssets()
  const asset = assets?.find(({ id }) => params.id === id)
  return <AssetForm asset={asset} />
}
