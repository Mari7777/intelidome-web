import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'

/**
 * Datum podle jazyka (A12): `Intl.DateTimeFormat` s číselným dnem, měsícem
 * a rokem. Pro češtinu dává přesně dnešní „19. 8. 2026“ (ověřeno testem
 * i18n-ui); jiné jazyky svůj běžný zápis („8/19/2026“, „19.8.2026“).
 * Prázdný timestamp = teď (původní chování).
 */
export const formatDateTime = (timestamp: string, locale: Locale = DEFAULT_LOCALE): string => {
  const date = timestamp ? new Date(timestamp) : new Date()
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'numeric', year: 'numeric' }).format(date)
}
