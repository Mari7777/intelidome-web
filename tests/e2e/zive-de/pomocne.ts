import type { APIResponse, Page } from '@playwright/test'

/** Proxy vyjednává a mění cookie jen při dokumentové navigaci (A7); API kontext ji sám nepošle. */
export const DOKUMENT = { Accept: 'text/html', 'Sec-Fetch-Dest': 'document' } as const

/** Všechny hodnoty `Location` (prod build je u 307 ze stránky někdy posílá dvakrát — viz scénář 7). */
export const hlavickyLocation = (res: APIResponse): string[] =>
  res
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'location')
    .map((h) => h.value)

/** Cesta z první `Location` (relativní i absolutní). */
export const cilPresmerovani = (res: APIResponse): string => {
  const location = hlavickyLocation(res)[0]
  return location ? new URL(location, res.url()).pathname : ''
}

/** Hlavičky skutečného požadavku RSC/prefetch z klientského routeru (Next bez `_rsc` sám přesměrovává). */
export const RSC = { Accept: 'text/x-component', RSC: '1', 'Sec-Fetch-Dest': 'empty' } as const

/** Hodnota `NEXT_LOCALE` ze Set-Cookie odpovědi, nebo null. */
export const cookieJazyka = (res: APIResponse): string | null => {
  const cookie = res
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => h.value)
    .find((v) => v.startsWith('NEXT_LOCALE='))
  return cookie ? cookie.split(';')[0].slice('NEXT_LOCALE='.length) : null
}

export const langZHtml = (html: string): string | null => html.match(/<html[^>]*\slang="([a-z]+)"/)?.[1] ?? null

export type Hlavicky = {
  lang: string
  title: string
  canonical: string | null
  hreflang: Record<string, string>
  ogLocale: string | null
  ogAlternate: string[]
  jsonLd: Record<string, unknown>[]
}

/** Metadata dokumentu z DOM: cesty místo absolutních adres (origin buildu se může lišit od portu). */
export async function hlavicky(page: Page): Promise<Hlavicky> {
  return page.evaluate(() => {
    const cesta = (href: string | null) => (href ? new URL(href, location.href).pathname : null)
    const hreflang: Record<string, string> = {}
    for (const l of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
      hreflang[l.getAttribute('hreflang')!] = cesta(l.getAttribute('href'))!
    }
    return {
      lang: document.documentElement.lang,
      title: document.title,
      canonical: cesta(document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null),
      hreflang,
      ogLocale: document.querySelector('meta[property="og:locale"]')?.getAttribute('content') ?? null,
      ogAlternate: [...document.querySelectorAll('meta[property="og:locale:alternate"]')].map((m) => m.getAttribute('content')!),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent ?? '{}')),
    }
  })
}

/** První BlogPosting z JSON-LD grafu článku. */
export const blogPosting = (h: Hlavicky): Record<string, unknown> | undefined => {
  for (const ld of h.jsonLd) {
    const graf = (ld['@graph'] as Record<string, unknown>[] | undefined) ?? []
    const uzel = graf.find((u) => u['@type'] === 'BlogPosting')
    if (uzel) return uzel
  }
  return undefined
}

export const cestaZUrl = (url: unknown): string => new URL(String(url)).pathname
