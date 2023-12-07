import { cookies } from 'next/headers'

// set locale in cookies
export async function POST(
  request: Request,
  { params }: { params: { locale: string } }
) {
  cookies().set('locale', params.locale)
}
