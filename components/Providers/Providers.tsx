'use client'
import 'styles/variables.scss'
import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'hooks/useTheme'
import { Session } from 'next-auth'
import { SWRConfig } from 'swr'
import { TranslationsProvider } from 'hooks/useTranslation'

function Providers({
  session,
  children,
  swrFallback: fallback,
  translations,
}: {
  children: React.ReactNode
  session: Session | null
  swrFallback: { [key: string]: any }
  translations: { translations: any; locale: string }
}) {
  return (
    <SWRConfig
      value={{
        suspense: true,
        fallback,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <SessionProvider session={session}>
        <ThemeProvider>
          <TranslationsProvider {...translations}>
            {children}
          </TranslationsProvider>
        </ThemeProvider>
      </SessionProvider>
    </SWRConfig>
  )
}
export default Providers
