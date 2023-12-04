'use client'
import 'styles/variables.scss'
import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'hooks/useTheme'
import { Session } from 'next-auth'
import { SWRConfig } from 'swr'

function Providers({
  session,
  children,
  swrFallback: fallback,
}: {
  children: React.ReactNode
  session: Session | null
  swrFallback: { [key: string]: any }
}) {
  return (
    <SWRConfig value={{ suspense: true, fallback }}>
      <SessionProvider session={session}>
        <ThemeProvider>{children}</ThemeProvider>
      </SessionProvider>
    </SWRConfig>
  )
}
export default Providers
