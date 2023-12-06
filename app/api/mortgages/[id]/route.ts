import { deleteMortgage, updateMortgage } from 'db/mortgages'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteMortgage(params.id)
  return Response.json({})
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const mortgage = await updateMortgage({
    ...(await request.json()),
    id: params.id,
  })
  return Response.json(mortgage)
}
