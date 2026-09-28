/**
 * Jazykové jádro webu (ADR-008). Čte ho proxy (Node runtime) i klientské
 * komponenty: jen konstanty, žádný env, žádné I/O, žádný payload.
 */
export const LOCALES = ['cs', 'en', 'de', 'hu', 'pl', 'es', 'it'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'cs'

export const jeLocale = (x: unknown): x is Locale =>
  typeof x === 'string' && (LOCALES as readonly string[]).includes(x)

/** `LIVE_LOCALES` žije v `./live.ts` (čte env) — jen pro server, ne do client komponent. */

export const COOKIE_JAZYK = 'NEXT_LOCALE'

/** Země (x-vercel-ip-country) → jazyk; jen záloha, když Accept-Language nic živého nenese. */
export const ZEME_NA_JAZYK: Record<string, Locale> = {
  CZ: 'cs',
  SK: 'cs',
  DE: 'de',
  AT: 'de',
  CH: 'de',
  HU: 'hu',
  PL: 'pl',
  ES: 'es',
  IT: 'it',
}

export const OG_LOCALE: Record<Locale, string> = {
  cs: 'cs_CZ',
  en: 'en_GB',
  de: 'de_DE',
  hu: 'hu_HU',
  pl: 'pl_PL',
  es: 'es_ES',
  it: 'it_IT',
}

/** Roboty nikdy nepřesměrováváme podle jazyka — každý jazyk má vlastní adresu a hreflang. */
export const ROBOT_UA =
  /googlebot|bingbot|yandex|duckduckbot|baiduspider|applebot|facebookexternalhit|twitterbot|linkedinbot|petalbot|ahrefsbot|semrushbot|gptbot|claudebot|perplexitybot|ccbot|seznambot|google-inspectiontool|googleother|bingpreview|meta-externalagent/i
