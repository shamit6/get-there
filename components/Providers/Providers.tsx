'use client'
import 'styles/variables.scss'
import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'hooks/useTheme'
import { Session } from 'next-auth'
import { SWRConfig } from 'swr'
import { Translations, TranslationsProvider } from 'hooks/useTranslation'

function Providers({
  session,
  children,
  swrFallback: fallback,
  translations,
}: {
  children: React.ReactNode
  session: Session | null
  swrFallback: { [key: string]: any }
  translations: Translations
}) {
  return (
    <SWRConfig value={{ suspense: true, fallback }}>
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
