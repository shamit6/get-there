import { createBalanceStatus, getBalanceStatuses } from 'db/balanceStatuses'

export async function GET(request: Request) {
  const balanceStatuses = await getBalanceStatuses()
  return Response.json(balanceStatuses)
}

export async function PUT(request: Request) {
  const { amount } = await request.json()
  const balanceStatus = await createBalanceStatus(amount)
  return Response.json(balanceStatus)
}
