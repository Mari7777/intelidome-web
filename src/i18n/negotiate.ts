import { DEFAULT_LOCALE, ZEME_NA_JAZYK, type Locale } from './config'

type Vstup = {
  acceptLanguage: string | null | undefined
  country?: string | null
  live: readonly Locale[]
}

/**
 * Volba jazyka pro kořen webu (A7): jazyk prohlížeče první, země jen záloha.
 * `null` = nepřesměrovávat (bez Accept-Language nevíme nic). Nikdy nevrací
 * jazyk mimo `live`.
 */
export function vyjednejJazyk({ acceptLanguage, country, live }: Vstup): Locale | null {
  if (!acceptLanguage || !acceptLanguage.trim()) return null

  const podleQ = acceptLanguage
    .split(',')
    .map((cast, poradi) => {
      const [tag, ...params] = cast.trim().split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
      const vaha = q ? Number.parseFloat(q.slice(2)) : 1
      return { tag: tag.toLowerCase(), vaha: Number.isFinite(vaha) ? vaha : 0, poradi }
    })
    .filter((z) => z.tag && z.vaha > 0)
    .sort((a, b) => b.vaha - a.vaha || a.poradi - b.poradi)

  for (const { tag } of podleQ) {
    // `de-AT` → `de`; `*` nic neříká.
    const zaklad = tag.split('-')[0]
    if ((live as readonly string[]).includes(zaklad)) return zaklad as Locale
  }

  const podleZeme = country ? ZEME_NA_JAZYK[country.toUpperCase()] : undefined
  if (podleZeme && live.includes(podleZeme)) return podleZeme

  return DEFAULT_LOCALE
}
