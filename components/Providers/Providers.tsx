'use client'
import 'styles/variables.scss'
import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'hooks/useTheme'
import { Session } from 'next-auth'

function Providers({
  session,
  children,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  )
}
export default Providers
