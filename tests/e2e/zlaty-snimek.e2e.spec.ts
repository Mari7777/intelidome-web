import { expect, test } from '@playwright/test'

/**
 * Zlatý snímek veřejného webu (ADR-008): každá přestavba routingu, jazyků
 * nebo metadat musí zachovat dnešní české adresy, obsah a hlavičky beze
 * změny. Porovnává se NORMALIZOVANÝ záznam (ne surové HTML — hashe tříd
 * a chunků by dávaly falešné rozdíly). Úmyslná změna = vědomá aktualizace
 * snímku v témže commitu (`npx playwright test --update-snapshots`).
 */

const SOUBORY = [
  '/feed.xml',
  '/sitemap.xml',
  '/posts-sitemap.xml',
  '/pages-sitemap.xml',
  '/robots.txt',
  '/llms.txt',
] as const

const BINARNI = ['/favicon.svg', '/apple-touch-icon.png', '/og-default.webp'] as const

const normalizujText = (text: string, origin: string) =>
  text
    .replaceAll(origin, 'ORIGIN')
    .replace(/<lastmod>[^<]*<\/lastmod>/g, '<lastmod>X</lastmod>')
    .replace(/<(pubDate|lastBuildDate)>[^<]*<\/\1>/g, '<$1>X</$1>')
    .replace(/\s+$/gm, '')
    .trim()

test.describe('zlatý snímek', () => {
  test('články z posts-sitemap a hlavní stránky drží obsah i hlavičky', async ({ page, request, baseURL }) => {
    const origin = baseURL!.replace(/\/$/, '')
    const sitemap = await (await request.get('/posts-sitemap.xml')).text()
    const clanky = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .sort()
    expect(clanky.length).toBeGreaterThanOrEqual(6)

    const zaznamy: Record<string, unknown> = {}
    for (const cesta of ['/', '/posts', '/search', ...clanky]) {
      const odpoved = await page.goto(cesta, { waitUntil: 'networkidle' })
      expect(odpoved?.status(), cesta).toBe(200)
      /* Chromium po `Critical-CH` požadavek opakuje jako interní 307 na TUTÉŽ
         adresu; skutečné přesměrování poznáme podle změny adresy. */
      const puvod = odpoved?.request().redirectedFrom()
      expect(puvod && puvod.url() !== odpoved?.url(), `${cesta} nesmí být přesměrována`).toBeFalsy()
      expect(new URL(page.url()).pathname, cesta).toBe(cesta)
      zaznamy[cesta] = await page.evaluate((origin) => {
        const abs = (href: string | null) => (href ? href.replace(origin, 'ORIGIN') : null)
        return {
          lang: document.documentElement.lang,
          title: document.title,
          canonical: abs(document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null),
          hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')]
            .map((l) => `${l.getAttribute('hreflang')} ${abs(l.getAttribute('href'))}`)
            .sort(),
          rss: abs(document.querySelector('link[type="application/rss+xml"]')?.getAttribute('href') ?? null),
          ogLocale: document.querySelector('meta[property="og:locale"]')?.getAttribute('content') ?? null,
          h1: document.querySelectorAll('h1').length,
          main: ((document.querySelector('main') ?? document.querySelector('article') ?? document.body) as HTMLElement).innerText.replace(/\s+/g, ' ').trim(),
          odkazy: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')).sort(),
        }
      }, origin)
    }
    expect(JSON.stringify(zaznamy, null, 1)).toMatchSnapshot('stranky.json')
  })

  test('textové soubory a feedy jsou beze změny', async ({ request, baseURL }) => {
    const origin = baseURL!.replace(/\/$/, '')
    const zaznamy: Record<string, unknown> = {}
    for (const cesta of SOUBORY) {
      const odpoved = await request.get(cesta, { maxRedirects: 0 })
      zaznamy[cesta] = {
        status: odpoved.status(),
        typ: (odpoved.headers()['content-type'] ?? '').split(';')[0],
        telo: odpoved.status() === 200 ? normalizujText(await odpoved.text(), origin) : null,
      }
    }
    expect(JSON.stringify(zaznamy, null, 1)).toMatchSnapshot('soubory.json')
  })

  test('statické soubory z public/ se servírují', async ({ request }) => {
    for (const cesta of BINARNI) {
      const odpoved = await request.get(cesta, { maxRedirects: 0 })
      expect(odpoved.status(), cesta).toBe(200)
      expect((odpoved.headers()['content-type'] ?? '').startsWith('text/html'), `${cesta} není HTML`).toBe(false)
    }
  })
})
