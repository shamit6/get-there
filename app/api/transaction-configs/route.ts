import {
  getTransactionConfigs,
  createTransactionConfig,
} from 'db/transactionConfigs'

export async function GET(request: Request) {
  const transactionconfigs = await getTransactionConfigs()
  return Response.json(transactionconfigs)
}

export async function POST(request: Request) {
  const transactionconfig = await createTransactionConfig(await request.json())
  return Response.json(transactionconfig)
}
