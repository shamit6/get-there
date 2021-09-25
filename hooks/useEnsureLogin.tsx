import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useUser from './useUser'

export default function useEnsureLogin() {
  const router = useRouter()
  const { user, loading } = useUser()
  useEffect(() => {
    if (!(user || loading)) {
      router.replace(
        router.pathname !== '/'
          ? `/login?redirect=${router.pathname}`
          : '/login'
      )
    }
  }, [user, loading])
}
