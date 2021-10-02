import { useSession } from 'next-auth/react'

export default function useUser() {
  const { data: session, status } = useSession()
  return { user: session?.user, loading: status === 'loading', status }
}
