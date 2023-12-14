import { deleteAsset, updateAsset } from 'db/assets'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const asset = await deleteAsset(params.id)
  return Response.json(asset)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const asset = await updateAsset({
    ...(await request.json()),
    id: params.id,
  })
  return Response.json(asset)
}
