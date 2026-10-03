import { expect, test } from '@playwright/test'

import { SLUG_NEPRELOZENY, SLUG_PRELOZENY } from './konstanty'
import { cilPresmerovani } from './pomocne'

/** Sitemapy, RSS a náhled (A19, A15) — soubory s tečkou jdou mimo proxy. */
const zaznamy = (xml: string) =>
  [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const telo = m[1]
    return {
      loc: new URL(telo.match(/<loc>([^<]+)<\/loc>/)![1]).pathname,
      hreflang: Object.fromEntries(
        [...telo.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((l) => [l[1], new URL(l[2]).pathname]),
      ),
    }
  })

test.describe('sitemapy, RSS, náhled', () => {
  test('11: sitemapy nesou jen přeložené de adresy s recipročním xhtml:link', async ({ request }) => {
    const cs = `/magazin/${SLUG_PRELOZENY}`
    const de = `/de/magazin/${SLUG_PRELOZENY}`
    const posts = zaznamy(await (await request.get('/posts-sitemap.xml')).text())
    const najdi = (loc: string) => posts.find((z) => z.loc === loc)
    expect(najdi(de)?.hreflang).toEqual({ cs, de, 'x-default': cs })
    expect(najdi(cs)?.hreflang).toEqual({ cs, de, 'x-default': cs })
    expect(najdi(`/de/magazin/${SLUG_NEPRELOZENY}`)).toBeUndefined()
    expect(najdi(`/magazin/${SLUG_NEPRELOZENY}`)?.hreflang).toEqual({})
    expect(posts.filter((z) => z.loc.startsWith('/de/'))).toHaveLength(1)

    const pages = zaznamy(await (await request.get('/pages-sitemap.xml')).text())
    const cesty = pages.map((z) => z.loc)
    expect(cesty).toContain('/de/magazin')
    expect(cesty).toContain('/de')
    expect(pages.find((z) => z.loc === '/magazin')?.hreflang).toEqual({ cs: '/magazin', de: '/de/magazin', 'x-default': '/magazin' })
    expect(pages.find((z) => z.loc === '/')?.hreflang).toEqual({ cs: '/', de: '/de', 'x-default': '/' })
  })

  test('12: /de/feed.xml → 200 s jednou položkou a language de; /cs/feed.xml → 308', async ({ request }) => {
    const de = await request.get('/de/feed.xml', { maxRedirects: 0 })
    expect(de.status()).toBe(200)
    expect(de.headers()['content-type']).toContain('application/rss+xml')
    const xml = await de.text()
    expect(xml.match(/<item>/g)).toHaveLength(1)
    expect(xml).toContain('<language>de</language>')
    expect(xml).toContain(`/de/magazin/${SLUG_PRELOZENY}</link>`)
    expect(xml).toContain('/de/feed.xml" rel="self"')

    const cs = await request.get('/cs/feed.xml', { maxRedirects: 0 })
    expect(cs.status()).toBe(308)
    expect(cilPresmerovani(cs)).toBe('/feed.xml')
  })

  test('19: náhled odmítne `//evil` (bez přihlášení nelze dál — jen kontrola cesty)', async ({ request }) => {
    const bezTajemstvi = await request.get('/next/preview?path=//evil', { maxRedirects: 0 })
    expect(bezTajemstvi.status()).toBe(403)

    // Se správným tajemstvím padne dřív kontrola `//` (500) než ověření uživatele (403).
    const tajemstvi = process.env.PREVIEW_SECRET
    test.info().annotations.push({ type: 'poznámka', description: tajemstvi ? 'PREVIEW_SECRET z .env' : 'PREVIEW_SECRET chybí — jen 403' })
    const res = await request.get(`/next/preview?path=//evil&previewSecret=${encodeURIComponent(tajemstvi ?? 'x')}`, {
      maxRedirects: 0,
    })
    expect(res.status()).toBe(tajemstvi ? 500 : 403)
  })
})
