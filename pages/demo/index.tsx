import { signIn } from 'next-auth/client'
import { useEffect } from 'react'

export default function DemoUser() {
  useEffect(() => {
    signIn('demo')
  }, [])

  return 'redirect'
}
