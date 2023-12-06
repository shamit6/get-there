import { createMortgage, getMortgages } from 'db/mortgages'

export async function GET(request: Request) {
  const mortgages = await getMortgages()
  return Response.json(mortgages)
}

export async function POST(request: Request) {
  const mortgage = await createMortgage(await request.json())
  return Response.json(mortgage)
}
