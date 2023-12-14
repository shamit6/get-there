import { createAsset, getAssets } from 'db/assets'

export async function GET(request: Request) {
  const assets = await getAssets()
  return Response.json(assets)
}

export async function POST(request: Request) {
  const asset = await createAsset(await request.json())
  return Response.json(asset)
}
