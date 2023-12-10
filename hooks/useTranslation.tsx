import React, { useCallback } from 'react'
import { PropsWithChildren } from 'react'

export interface Translations {
  t: (key: string) => string
  locale: string
}

const TranslationsContext = React.createContext({
  locale: 'en',
  t: (key: string) => key,
} as Translations)

export function TranslationsProvider({
  children,
  translations,
  locale,
}: PropsWithChildren<{
  translations: Record<string, string>
  locale: string
}>) {
  const t = useCallback(
    (key: string) => {
      return translations[key] ?? key
    },
    [translations]
  )

  return (
    <TranslationsContext.Provider value={{ t, locale }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslation() {
  const value = React.useContext(TranslationsContext)
  return value
}
