import { expect, test, type Page } from '@playwright/test'

import { SLUG_PRELOZENY } from './konstanty'

/** Přepínač jazyků (A20) a přístupnost odkazů pod `/de/…`. */
const cookie = async (page: Page) => (await page.context().cookies()).find((c) => c.name === 'NEXT_LOCALE')?.value

test.describe('přepínač jazyků', () => {
  test('13: hlavička i patička ≥ 640 px; klik de → /de/… (měkká navigace, cookie de až po plném načtení); klik cs → /magazin/… (cookie cs po načtení)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    const cs = `/magazin/${SLUG_PRELOZENY}`
    const de = `/de/magazin/${SLUG_PRELOZENY}`
    await page.goto(cs)
    expect(await cookie(page)).toBe('cs')

    const hlavickaDe = page.locator('header .id-capsule a[lang="de"]')
    await expect(hlavickaDe).toBeVisible()
    await expect(hlavickaDe).toHaveAttribute('href', de)
    await expect(page.locator('header .id-capsule a[lang="cs"]')).toHaveAttribute('aria-current', 'true')
    await expect(page.locator('header .id-capsule a[lang="de"]')).not.toHaveAttribute('aria-current', /.*/)
    await expect(page.locator('footer a[lang="de"]')).toHaveAttribute('href', de)
    await expect(page.locator('footer a[lang="cs"]')).toHaveAttribute('aria-current', 'true')

    await Promise.all([page.waitForURL(de), hlavickaDe.click()])
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expect(page.locator('header .id-capsule a[lang="de"]')).toHaveAttribute('aria-current', 'true')
    /* Klik je měkká navigace routeru (RSC fetch s `RSC: 1`, kořenový layout
       `[locale]` je týž soubor), proxy proto cookie NEMĚNÍ — zůstává cs; až
       plné načtení `/de/…` ji přepne (ADR-008, Známá omezení). Bez dopadu:
       proxy hodnotu cookie nikdy nečte jako vstup, jen její přítomnost a
       rovnost s jazykem adresy. Tvrdá navigace by byla `<a>` místo `<Link>`. */
    const poKliku = await cookie(page)
    test.info().annotations.push({ type: 'zjištění', description: `cookie po kliku na de: ${poKliku} (měkká navigace)` })
    expect(poKliku).toBe('cs')
    await page.reload()
    expect(await cookie(page)).toBe('de')

    const patickaCs = page.locator('footer a[lang="cs"]')
    await patickaCs.scrollIntoViewIfNeeded()
    await Promise.all([page.waitForURL(cs), patickaCs.click()])
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
    expect(await cookie(page)).toBe('de')
    await page.reload()
    expect(await cookie(page)).toBe('cs')
  })

  test.describe('dotykové zařízení (393 px)', () => {
    test.use({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true })

    test('13b: přepínač jen v patičce, odkazy s dotykovým cílem ≥ 24 px', async ({ page }) => {
      await page.goto(`/magazin/${SLUG_PRELOZENY}`)
      await expect(page.locator('header .id-capsule a[lang="de"]')).toBeHidden()
      const paticka = page.locator('footer a[lang="de"]')
      await paticka.scrollIntoViewIfNeeded()
      await expect(paticka).toBeVisible()
      const box = await paticka.boundingBox()
      // Sekce 7: `py-1 -my-1` — cíl ≥ 24 px, řádek s © nevyrostl.
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(24)
      await expect(page.locator('footer a[lang="cs"]')).toHaveAttribute('aria-current', 'true')
    })
  })

  test('14: každý odkaz v kapsli a patičce má jméno, žádný img[alt=""]; UI česky (fallback zaznamenán)', async ({ page }) => {
    for (const cesta of ['/de', `/de/magazin/${SLUG_PRELOZENY}`]) {
      await page.goto(cesta)
      const nalez = await page.evaluate(() => {
        const jmeno = (a: Element) => (a.textContent?.trim() || a.getAttribute('aria-label') || '').trim()
        const bezJmena = [...document.querySelectorAll('.id-capsule a, footer a')].filter((a) => !jmeno(a)).map((a) => a.outerHTML)
        const prazdnyAlt = [...document.querySelectorAll('img[alt=""]')].map((i) => i.outerHTML)
        return {
          bezJmena,
          prazdnyAlt,
          navAria: document.querySelector('header nav')?.getAttribute('aria-label'),
          footerAria: document.querySelector('footer nav')?.getAttribute('aria-label'),
          langAria: document.querySelector('footer nav[aria-label]:has(a[lang])')?.getAttribute('aria-label'),
        }
      })
      expect(nalez.bezJmena, cesta).toEqual([])
      expect(nalez.prazdnyAlt, cesta).toEqual([])
      // Slovník de je prázdný → UI řetězce padají na češtinu (A11); jen záznam, ne chyba.
      expect(nalez.navAria).toBe('Hlavní navigace')
      test.info().annotations.push({
        type: 'poznámka',
        description: `${cesta}: UI česky (fallback) — nav „${nalez.navAria}“, patička „${nalez.footerAria}“, přepínač „${nalez.langAria}“`,
      })
    }
  })
})
