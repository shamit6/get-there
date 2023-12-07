'use server'

import { cookies } from 'next/headers'

export async function setLocale(locale: string): Promise<void> {
  cookies().set('locale', locale)
}
