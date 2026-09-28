import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'

import { SLUG_PRELOZENY } from './konstanty'

/** Přejímky DS (mřížka, popisky kreseb) a kotvy na přeložené adrese — vůči české verzi beze změny. */
const spust = (skript: string, ...args: string[]) =>
  execFileSync('node', [`scripts/${skript}`, ...args], { encoding: 'utf8', timeout: 150_000 })

test.describe('přejímky na /de', () => {
  test('17: layout-check (1440) shodný s cs; svg-labels (393) bez kolizí a ořezů', async ({ baseURL }) => {
    test.setTimeout(300_000)
    const de = `${baseURL}/de/posts/${SLUG_PRELOZENY}`
    const cs = `${baseURL}/posts/${SLUG_PRELOZENY}`

    const mrizkaDe = spust('layout-check.mjs', de, '1440')
    const mrizkaCs = spust('layout-check.mjs', cs, '1440')
    // Překlad nemění kompozici: shodný protokol mřížky s českou verzí.
    expect(mrizkaDe).toBe(mrizkaCs)
    const jednorazove = Number(mrizkaDe.match(/jednorázových os: (\d+)/)?.[1])
    test.info().annotations.push({ type: 'poznámka', description: `jednorázových os: ${jednorazove} (stejně jako cs)` })
    expect(jednorazove).toBe(Number(mrizkaCs.match(/jednorázových os: (\d+)/)?.[1]))

    const popisky = spust('svg-labels.mjs', de, '393', '3')
    const kresby = popisky.match(/kresba \d+/g)?.length ?? 0
    for (const radek of popisky.split('\n').filter((r) => r.includes('kresba'))) {
      expect(radek).toMatch(/kolizí 0, ořezů 0/)
    }
    test.info().annotations.push({ type: 'poznámka', description: `kreseb: ${kresby} (kresby zůstávají česky)` })
  })

  test('18: kotva #obsah na /de/posts/… dojede na 124 px (stejně jako cs)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const cesta of [`/posts/${SLUG_PRELOZENY}#obsah`, `/de/posts/${SLUG_PRELOZENY}#obsah`]) {
      await page.goto(cesta, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      const top = await page.evaluate(() => document.getElementById('obsah')?.getBoundingClientRect().top ?? NaN)
      expect(Math.abs(top - 124), `${cesta}: top ${top}`).toBeLessThanOrEqual(2)
    }
  })
})
