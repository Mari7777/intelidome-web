import { redirect } from 'next/navigation'

import type { Locale } from './config'
import { LIVE_LOCALES } from './live'

/**
 * Jazyk mimo `LIVE_LOCALES` existuje jen jako adresa: každá jeho stránka jde
 * 307 na českou verzi (A6). DraftMode se nechává projít, aby šel překlad
 * prohlédnout před zapnutím jazyka. Volat na začátku každé stránky pod `[locale]`.
 */
export function vynutZivost(locale: Locale, csCesta: string, draft: boolean): void {
  if (locale !== 'cs' && !LIVE_LOCALES.includes(locale) && !draft) redirect(csCesta)
}
