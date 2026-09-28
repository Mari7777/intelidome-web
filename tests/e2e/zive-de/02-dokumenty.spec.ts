import { expect, test } from '@playwright/test'

import { DE_TITUL_CLANKU, DE_TITUL_HOME, SLUG_NEPRELOZENY, SLUG_PRELOZENY } from './konstanty'
import { DOKUMENT, blogPosting, cestaZUrl, cilPresmerovani, hlavicky, hlavickyLocation } from './pomocne'

/** Dokumenty pod `/de/…` (A6) a SEO po jazycích (A19) s jedním přeloženým článkem a přeloženou home. */
test.describe('dokumenty a SEO s živou němčinou', () => {
  test('7: nepřeložený článek pod /de → právě jedno 307 na cs; neexistující → 404 přímo', async ({ request }) => {
    const prvni = await request.get(`/de/posts/${SLUG_NEPRELOZENY}`, { headers: DOKUMENT, maxRedirects: 0 })
    expect(prvni.status()).toBe(307)
    expect(cilPresmerovani(prvni)).toBe(`/posts/${SLUG_NEPRELOZENY}`)
    // `Location` u 307 ze stránky: v jednom běhu prod buildu dvakrát (shodné hodnoty), jindy jednou — jen záznam, hodnoty se musí shodovat.
    const location = hlavickyLocation(prvni)
    expect(new Set(location).size).toBe(1)
    test.info().annotations.push({ type: 'poznámka', description: `Location ×${location.length}: ${location.join(' | ')}` })
    const druhy = await request.get(cilPresmerovani(prvni), { headers: DOKUMENT, maxRedirects: 0 })
    expect(druhy.status()).toBe(200)

    const chybi = await request.get('/de/posts/neexistuje', { headers: DOKUMENT, maxRedirects: 0 })
    expect(chybi.status()).toBe(404)
  })

  test('8: přeložený článek pod /de → 200, lang de, canonical, reciproční hreflang, og:locale, JSON-LD', async ({ page }) => {
    const cs = `/posts/${SLUG_PRELOZENY}`
    const de = `/de/posts/${SLUG_PRELOZENY}`

    const odpoved = await page.goto(de)
    expect(odpoved?.status()).toBe(200)
    expect(new URL(page.url()).pathname).toBe(de)
    const h = await hlavicky(page)
    expect(h.lang).toBe('de')
    expect(h.title).toContain(DE_TITUL_CLANKU)
    expect(h.canonical).toBe(de)
    expect(h.hreflang).toEqual({ cs, de, 'x-default': cs })
    expect(h.ogLocale).toBe('de_DE')
    expect(h.ogAlternate).toEqual(['cs_CZ'])
    const clanek = blogPosting(h)!
    expect(clanek.inLanguage).toBe('de')
    expect(cestaZUrl(clanek.url)).toBe(de)
    expect(cestaZUrl((clanek.translationOfWork as { url: string }).url)).toBe(cs)
    expect(clanek.workTranslation).toBeUndefined()

    // Reciproční strana: česká verze téhož článku inzeruje de.
    await page.goto(cs)
    const hc = await hlavicky(page)
    expect(hc.lang).toBe('cs')
    expect(hc.canonical).toBe(cs)
    expect(hc.hreflang).toEqual({ cs, de, 'x-default': cs })
    expect(hc.ogLocale).toBe('cs_CZ')
    expect(hc.ogAlternate).toEqual(['de_DE'])
    const original = blogPosting(hc)!
    expect(original.inLanguage).toBe('cs')
    expect((original.workTranslation as { inLanguage: string; url: string }[]).map((p) => [p.inLanguage, cestaZUrl(p.url)])).toEqual([['de', de]])
  })

  test('9: nepřeložený článek → žádný hreflang (jediný jazyk dokumentu)', async ({ page }) => {
    await page.goto(`/posts/${SLUG_NEPRELOZENY}`)
    const h = await hlavicky(page)
    expect(h.hreflang).toEqual({})
    expect(h.ogAlternate).toEqual([])
    expect(h.canonical).toBe(`/posts/${SLUG_NEPRELOZENY}`)
  })

  test('10: /de home 200; /de/posts právě jedna karta + hreflang výpisu; /de/search jen přeložené', async ({ page }) => {
    const home = await page.goto('/de')
    expect(home?.status()).toBe(200)
    expect(new URL(page.url()).pathname).toBe('/de')
    const hh = await hlavicky(page)
    expect(hh.lang).toBe('de')
    expect(hh.title).toContain(DE_TITUL_HOME)
    expect(hh.hreflang).toEqual({ cs: '/', de: '/de', 'x-default': '/' })

    const vypis = await page.goto('/de/posts')
    expect(vypis?.status()).toBe(200)
    expect(new URL(page.url()).pathname).toBe('/de/posts')
    await expect(page.locator('article')).toHaveCount(1)
    await expect(page.locator(`a[href="/de/posts/${SLUG_PRELOZENY}"]`).first()).toBeVisible()
    await expect(page.locator(`a[href*="/posts/${SLUG_NEPRELOZENY}"]`)).toHaveCount(0)
    // Sekce 6: HTML výpisu souhlasí se sitemapou (reciproční hreflang cs/de/x-default).
    expect((await hlavicky(page)).hreflang).toEqual({ cs: '/posts', de: '/de/posts', 'x-default': '/posts' })
    await page.goto('/posts')
    expect((await hlavicky(page)).hreflang).toEqual({ cs: '/posts', de: '/de/posts', 'x-default': '/posts' })

    await page.goto('/de/search?q=Zazimov%C3%A1n%C3%AD')
    await expect(page.locator(`a[href="/de/posts/${SLUG_PRELOZENY}"]`).first()).toBeVisible()
    await expect(page.locator(`a[href*="/posts/${SLUG_NEPRELOZENY}"]`)).toHaveCount(0)
    // Dotaz, který sedí jen na české titulky nepřeložených článků: v de nic.
    await page.goto('/de/search?q=z%C3%A1vlahu')
    await expect(page.locator('a[href^="/de/posts/"]')).toHaveCount(0)
  })
})
