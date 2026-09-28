import type { ISitemapField } from 'next-sitemap'

import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'
import { lokalizujCestu, verejnaCesta } from '@/i18n/routing'

/**
 * Sitemapy po jazycích (A19). Čistý modul bez Payloadu: dokumenty přicházejí
 * z jednoho čtení `locale: 'all'` (`prelozeno` je mapa `{ en: true, … }`),
 * živé jazyky parametrem. Serializaci dělá `getServerSideSitemap` z next-sitemap
 * (dnešní výstup; `xmlns:xhtml` na `<urlset>` nese už dnes vždy), `xhtml:link`
 * alternates jen při ≥ 2 jazycích — jediný jazyk = dnešní záznam beze změny.
 */

type Kolekce = 'posts' | 'pages'

export type SitemapDokument = {
  slug?: string | null
  updatedAt?: string | null
  /** Při `locale: 'all'` mapa po jazycích; jinak boolean (počítá se jen cs). */
  prelozeno?: unknown
}

/** `['cs', …prelozeno[l] === true] ∩ zive` — týž predikát jako `prekladyDokumentu`. */
export function jazykyDokumentu(prelozeno: unknown, zive: readonly Locale[]): Locale[] {
  const mapa = (prelozeno && typeof prelozeno === 'object' ? prelozeno : {}) as Partial<Record<Locale, unknown>>
  return LOCALES.filter((kod) => (kod === DEFAULT_LOCALE || mapa[kod] === true) && zive.includes(kod))
}

const alternates = (siteUrl: string, cesty: (kod: Locale) => string, jazyky: readonly Locale[]) =>
  jazyky.length >= 2
    ? {
        alternateRefs: [
          ...jazyky.map((kod) => ({ href: siteUrl + cesty(kod), hreflang: kod })),
          { href: siteUrl + cesty(DEFAULT_LOCALE), hreflang: 'x-default' },
        ],
      }
    : {}

/** Záznamy dokumentů: každý jazyk vlastní `<url>`, při ≥ 2 reciproční hreflang z jedné množiny + x-default. */
export function sitemapZaznamy(
  collection: Kolekce,
  docs: readonly SitemapDokument[],
  siteUrl: string,
  zive: readonly Locale[],
): ISitemapField[] {
  const zaznamy: ISitemapField[] = []
  for (const doc of docs) {
    if (!doc.slug) continue
    const slug = doc.slug
    const jazyky = jazykyDokumentu(doc.prelozeno, zive)
    const cesta = (kod: Locale) => verejnaCesta(collection, slug, kod)
    for (const kod of jazyky) {
      zaznamy.push({
        loc: siteUrl + cesta(kod),
        ...(doc.updatedAt ? { lastmod: doc.updatedAt } : {}),
        ...alternates(siteUrl, cesta, jazyky),
      })
    }
  }
  return zaznamy
}

/** Jazyky, ve kterých výpis `/posts` existuje: cs + živé jazyky s ≥ 1 přeloženým článkem. */
export function jazykyVypisu(posts: readonly SitemapDokument[], zive: readonly Locale[]): Locale[] {
  return LOCALES.filter(
    (kod) => zive.includes(kod) && (kod === DEFAULT_LOCALE || posts.some((p) => jazykyDokumentu(p.prelozeno, zive).includes(kod))),
  )
}

/** Záznamy výpisu článků (`/posts`, `/en/posts`, …) bez lastmod, s hreflang při ≥ 2. */
export function sitemapVypisu(posts: readonly SitemapDokument[], siteUrl: string, zive: readonly Locale[]): ISitemapField[] {
  const jazyky = jazykyVypisu(posts, zive)
  const cesta = (kod: Locale) => lokalizujCestu('/posts', kod)
  return jazyky.map((kod) => ({ loc: siteUrl + cesta(kod), ...alternates(siteUrl, cesta, jazyky) }))
}
