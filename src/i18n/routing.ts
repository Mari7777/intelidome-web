import { DEFAULT_LOCALE, LOCALES, jeLocale, type Locale } from './config'

/** Cesty, které jazykový prefix nikdy nenesou (API, admin, náhled, Next interní). */
const BEZ_PREFIXU = ['/api', '/admin', '/next', '/_next', '/_vercel']

const rozdel = (href: string): [string, string] => {
  const konec = href.search(/[?#]/)
  return konec === -1 ? [href, ''] : [href.slice(0, konec), href.slice(konec)]
}

/**
 * Přidá jazykový prefix k interní cestě (A13). Čeština je bez prefixu, proto
 * pro `cs` vrací vstup beze změny. Externí adresy, kotvy, `//`, soubory
 * s příponou a interní cesty Nextu nechává být; už prefixovanou cestu neprefixuje znovu.
 */
export function lokalizujCestu(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const [cesta, zbytek] = rozdel(href)
  if (BEZ_PREFIXU.some((p) => cesta === p || cesta.startsWith(p + '/'))) return href
  const posledni = cesta.slice(cesta.lastIndexOf('/') + 1)
  if (posledni.includes('.')) return href
  const prvni = cesta.split('/')[1]
  if (jeLocale(prvni)) return href
  if (locale === DEFAULT_LOCALE) return href
  return '/' + locale + (cesta === '/' ? '' : cesta) + zbytek
}

/** `/en/magazin/x` → `{ en, '/magazin/x' }`; neprefixovaná cesta je česká. */
export function odstranPrefix(pathname: string): { locale: Locale; path: string } {
  const prvni = pathname.split('/')[1]
  if (jeLocale(prvni)) {
    const path = pathname.slice(prvni.length + 1)
    return { locale: prvni, path: path === '' ? '/' : path }
  }
  return { locale: DEFAULT_LOCALE, path: pathname }
}

type Kolekce = 'posts' | 'pages'

/**
 * Veřejný segment článků (ADR-009). Kolekce Payloadu se dál jmenuje `posts`,
 * mění se jen adresa: článek `/magazin/x`, domovská stránka článků `/magazin`.
 */
export const CESTA_MAGAZINU = '/magazin'

/** Neprefixovaná cesta dokumentu (`/magazin/x`, `/x`, home `/`) — jediný zdroj adresy dokumentu. */
export const zakladniCesta = (collection: Kolekce, slug: string): string => {
  if (collection === 'posts') return `${CESTA_MAGAZINU}/${slug}`
  return slug === 'home' ? '/' : `/${slug}`
}

/** Neprefixovaná cesta domovské stránky magazínu; strana 2+ je `/magazin/strana/N` (ADR-009 bod 3). */
export const cestaMagazinu = (strana = 1): string =>
  strana > 1 ? `${CESTA_MAGAZINU}/strana/${strana}` : CESTA_MAGAZINU

/**
 * Cesty ROUTE STROMU pro revalidaci — vždy s `/cs`, i když veřejná česká
 * adresa prefix nemá: `revalidatePath` s rewritem cílí na cílovou cestu
 * (`/cs/magazin/x`), `/magazin/x` by cache netrefilo.
 */
export function interniCesty(collection: Kolekce, slug: string): string[] {
  const zaklad = zakladniCesta(collection, slug)
  return LOCALES.map((kod) => '/' + kod + (zaklad === '/' ? '' : zaklad))
}

/** Veřejná adresa dokumentu (`/magazin/x`, `/en/magazin/x`, home `/` | `/en`). */
export function verejnaCesta(collection: Kolekce, slug: string, locale: Locale): string {
  return lokalizujCestu(zakladniCesta(collection, slug), locale)
}

/**
 * RSS kanál jazyka (`/feed.xml`, `/en/feed.xml`). Výslovně, ne přes
 * `lokalizujCestu`: ta soubory s příponou úmyslně neprefixuje (A13).
 */
export function rssCesta(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/feed.xml' : `/${locale}/feed.xml`
}
