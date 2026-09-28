import { DEFAULT_LOCALE, type Locale } from './config'

/* Čistý modul (bez Payloadu): smí ho importovat i klientská komponenta.
   `dokumenty.ts` ho re-exportuje pro server. */

export type SPriznakem = { prelozeno?: boolean | null } | null | undefined

/** Čeština vždy; jiný jazyk jen se zaškrtnutým „Překlad hotový“ (A4, A18). */
export function zobrazitelny(doc: SPriznakem, locale: Locale): boolean {
  return locale === DEFAULT_LOCALE || doc?.prelozeno === true
}
