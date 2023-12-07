import React from 'react'
import { PropsWithChildren } from 'react'

export interface Translations {
  translations: Record<string, string>
  locale: string
}

const TranslationsContext = React.createContext({
  translations: {},
  locale: 'en',
} as Translations)

export function TranslationsProvider({
  children,
  translations,
  locale,
}: PropsWithChildren<Translations>) {
  return (
    <TranslationsContext.Provider value={{ translations, locale }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslation() {
  const value = React.useContext(TranslationsContext)
  return value
}
