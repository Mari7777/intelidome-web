import { expect, test } from '@playwright/test'

import { SLUG_NEPRELOZENY, SLUG_PRELOZENY } from './konstanty'
import { DOKUMENT, RSC, cilPresmerovani, cookieJazyka, langZHtml } from './pomocne'

/**
 * Volba jazyka na kořeni (A7) proti prod serveru s `LIVE_LOCALES=cs,de`.
 * Každý test má čerstvý API kontext (bez cookie); hlavičky dokumentové
 * navigace se posílají výslovně — bez nich proxy nevyjednává ani nesahá na cookie.
 */
test.describe('vyjednávání jazyka na kořeni', () => {
  test('1: Accept-Language de bez cookie → 302 /de + cookie de; /de → 200 lang de', async ({ request }) => {
    const res = await request.get('/', {
      headers: { ...DOKUMENT, 'Accept-Language': 'de-AT,de;q=0.9,en;q=0.8' },
      maxRedirects: 0,
    })
    expect(res.status()).toBe(302)
    expect(cilPresmerovani(res)).toBe('/de')
    expect(cookieJazyka(res)).toBe('de')

    const de = await request.get('/de', { headers: DOKUMENT, maxRedirects: 0 })
    expect(de.status()).toBe(200)
    expect(langZHtml(await de.text())).toBe('de')
  })

  test('2: hluboký odkaz s Accept-Language de → 200 cs, žádné přesměrování', async ({ playwright, baseURL }) => {
    for (const cesta of [`/magazin/${SLUG_PRELOZENY}`, `/magazin/${SLUG_NEPRELOZENY}`]) {
      // Čerstvý kontext: bez cookie z předchozí odpovědi.
      const kontext = await playwright.request.newContext({ baseURL })
      const res = await kontext.get(cesta, { headers: { ...DOKUMENT, 'Accept-Language': 'de' }, maxRedirects: 0 })
      expect(res.status(), cesta).toBe(200)
      expect(langZHtml(await res.text()), cesta).toBe('cs')
      // Brána: cookie sleduje jazyk adresy (cs), ne prohlížeče.
      expect(cookieJazyka(res), cesta).toBe('cs')
      await kontext.dispose()
    }
  })

  test('3: bez Accept-Language + země DE → 200 cs (bez jazyka prohlížeče nic)', async ({ request }) => {
    const res = await request.get('/', { headers: { ...DOKUMENT, 'x-vercel-ip-country': 'DE' }, maxRedirects: 0 })
    expect(res.status()).toBe(200)
    expect(langZHtml(await res.text())).toBe('cs')
  })

  test('4: Accept-Language fr + země DE → 302 /de (země jako záloha)', async ({ request }) => {
    const res = await request.get('/', {
      headers: { ...DOKUMENT, 'Accept-Language': 'fr-FR,fr;q=0.9', 'x-vercel-ip-country': 'DE' },
      maxRedirects: 0,
    })
    expect(res.status()).toBe(302)
    expect(cilPresmerovani(res)).toBe('/de')
    expect(cookieJazyka(res)).toBe('de')
  })

  for (const ua of [
    'Mozilla/5.0 (compatible; SeznamBot/4.0; +http://napoveda.seznam.cz/seznambot-intro/)',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  ]) {
    test(`5: robot ${ua.split(';')[1].trim()} s Accept-Language de → 200 cs, cookie jen jazyk adresy (cs)`, async ({ request }) => {
      const res = await request.get('/', {
        headers: { ...DOKUMENT, 'Accept-Language': 'de', 'User-Agent': ua },
        maxRedirects: 0,
      })
      expect(res.status()).toBe(200)
      expect(langZHtml(await res.text())).toBe('cs')
      // Roboti se nepřesměrovávají; brána (rewrite) jim nastaví jazyk adresy (cs), nikdy de (ADR-008 §11).
      expect(cookieJazyka(res)).toBe('cs')
    })
  }

  test('6: cookie NEXT_LOCALE=de na kořeni → 200 cs (cookie je brána, ne vstup)', async ({ request }) => {
    const res = await request.get('/', {
      headers: { ...DOKUMENT, 'Accept-Language': 'de', Cookie: 'NEXT_LOCALE=de' },
      maxRedirects: 0,
    })
    expect(res.status()).toBe(200)
    expect(langZHtml(await res.text())).toBe('cs')
    // Brána se srovná s adresou: cookie se přepíše na cs.
    expect(cookieJazyka(res)).toBe('cs')
  })

  test('15: požadavek RSC/prefetch cookie nemění ani nepřesměrovává', async ({ request }) => {
    // Bez routerových hlaviček Next čeká prázdný `_rsc` (jinak sám pošle 307 na správný hash).
    const de = await request.get('/de?_rsc', { headers: RSC, maxRedirects: 0 })
    expect(de.status()).toBe(200)
    expect(de.headers()['content-type']).toContain('text/x-component')
    expect(cookieJazyka(de)).toBeNull()

    const koren = await request.get('/?_rsc', { headers: { ...RSC, 'Accept-Language': 'de' }, maxRedirects: 0 })
    expect(koren.status()).toBe(200)
    expect(cookieJazyka(koren)).toBeNull()
  })

  test('16: /cs/magazin/x → 308 na /magazin/x; /search?q=puda přežije rewrite', async ({ page, request }) => {
    const res = await request.get(`/cs/magazin/${SLUG_NEPRELOZENY}`, { headers: DOKUMENT, maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(cilPresmerovani(res)).toBe(`/magazin/${SLUG_NEPRELOZENY}`)

    // Dotaz musí dojít až k serverovému hledání (rewrite přes `nextUrl.clone()`):
    // hledaný výraz vrátí karty, nesmysl „Nic jsme nenašli“. Pole hledání se
    // z adresy nepředvyplňuje (dnešní chování komponenty), proto se měří výsledek.
    const odpoved = await page.goto('/search?q=z%C3%A1vlah')
    expect(odpoved?.status()).toBe(200)
    expect(new URL(page.url()).search).toBe('?q=z%C3%A1vlah')
    expect(await page.locator('a[href^="/magazin/"]').count()).toBeGreaterThan(0)
    await expect(page.getByText('Nic jsme nenašli.')).toHaveCount(0)

    await page.goto('/search?q=puda')
    expect(new URL(page.url()).search).toBe('?q=puda')
    await expect(page.getByText('Nic jsme nenašli.')).toBeVisible()
  })
})
