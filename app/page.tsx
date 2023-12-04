import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'

export default async function Page() {
  const session = await getServerSession(nextAuthOptions)
  return (
    <div>
      <h1>Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
