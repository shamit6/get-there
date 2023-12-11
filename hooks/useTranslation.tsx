import React, { useCallback } from 'react'
import { PropsWithChildren } from 'react'

export interface Translations {
  t: (key: string, variables?: Record<string, string>) => string
  locale: string
}

function createStringFromTemplate(
  template: string,
  variables: Record<string, string> = {}
) {
  return template.replace(
    new RegExp('{([^{]+)}', 'g'),
    function (_unused, varName) {
      return variables[varName]
    }
  )
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
    (key: string, variables?: Record<string, string>) => {
      return createStringFromTemplate(translations[key], variables) ?? key
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
