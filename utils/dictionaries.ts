import { cookies } from 'next/headers'
import 'server-only'

const dictionaries: Record<string, () => Promise<Record<string, any>>> = {
  en: () =>
    import('../public/locales/en/common.json').then((module) => module.default),
  he: () =>
    import('../public/locales/he/common.json').then((module) => module.default),
}

export async function getDictionary(): Promise<{
  translations: Record<string, string>
  locale: string
}> {
  const locale = cookies().get('locale')?.value ?? 'en'
  const translations = await dictionaries[locale]()
  return {
    translations,
    locale,
  }
}
