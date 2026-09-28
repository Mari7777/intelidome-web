import { DEFAULT_LOCALE, LOCALES, jeLocale, type Locale } from './config'

/**
 * Jazyky, které web nabízí a detekuje (A3). Rozšířit až s hotovým překladem
 * (home + články, slovník UI) v témž commitu. Override jen pro testy:
 * env LIVE_LOCALES="cs,de" (build-time, validovaný proti LOCALES; cs je
 * živá vždy — bez ní by web neměl kam přesměrovat).
 *
 * Jen server (proxy, `vynutZivost`, layout): v klientském bundlu je env
 * prázdný a hodnota by se lišila od serveru (hydration mismatch). Klientské
 * komponenty dostávají živé jazyky propem `liveLocales` z layoutu (A20).
 */
const zEnv = (process.env.LIVE_LOCALES ?? '')
  .split(',')
  .map((kod) => kod.trim())
  .filter(jeLocale)

export const LIVE_LOCALES: readonly Locale[] = zEnv.length
  ? LOCALES.filter((kod) => kod === DEFAULT_LOCALE || zEnv.includes(kod))
  : [DEFAULT_LOCALE]
