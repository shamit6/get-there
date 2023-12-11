import 'server-only'
import { cookies, headers } from 'next/headers'
import resolveAcceptLanguage from 'resolve-accept-language'
const dictionaries: Record<string, () => Promise<Record<string, any>>> = {
  en: () =>
    import('../public/locales/en/common.json').then((module) => module.default),
  he: () =>
    import('../public/locales/he/common.json').then((module) => module.default),
}

function detectLocaleFromHeaders(): string {
  const acceptLanguage = headers().get('accept-language') ?? ''
  const locale = resolveAcceptLanguage(
    acceptLanguage,
    ['en-US', 'he-IL'],
    'en-US'
  )
  return locale.split('-')[0]
}

export async function getDictionary(): Promise<{
  translations: Record<string, string>
  locale: string
}> {
  const locale = cookies().get('locale')?.value ?? detectLocaleFromHeaders()
  const translations = await dictionaries[locale]()
  return {
    translations,
    locale,
  }
}
