import {
  deleteTransactionConfig,
  updateTransactionConfig,
} from 'db/transactionConfigs'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transactionconfig = await deleteTransactionConfig(params.id)
  return Response.json(transactionconfig)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transactionconfig = await updateTransactionConfig({
    ...(await request.json()),
    id: params.id,
  })
  return Response.json(transactionconfig)
}
