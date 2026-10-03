// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { config } from '../../src/proxy'

/**
 * Matcher proxy (A8) je path-to-regexp literál `/(<regex>)`; tady ho čteme
 * jako obyčejný regex nad celou cestou. Vyhrazené prefixy musí platit jen na
 * hranici segmentu — `/nextgen-zavlaha` je běžná stránka, ne `/next/…`.
 */
const vzor = new RegExp('^' + config.matcher[0].replace(/^\/\(/, '/(') + '$')
const proxyChyta = (cesta: string) => vzor.test(cesta)

describe('matcher proxy', () => {
  it('obchází vyhrazené cesty a soubory s příponou', () => {
    for (const cesta of [
      '/api',
      '/api/media/file/x.avif',
      '/admin',
      '/admin/collections/posts',
      '/next/preview',
      '/_next/static/a.js',
      '/_vercel/insights/view',
      '/robots.txt',
      '/sitemap.xml',
      '/feed.xml',
      '/favicon.svg',
      '/.well-known/x',
    ]) {
      expect(proxyChyta(cesta), cesta).toBe(false)
    }
  })

  it('chytá běžné stránky včetně slugů začínajících na vyhrazený prefix', () => {
    for (const cesta of [
      '/',
      '/magazin',
      '/magazin/pisek-biochar-a-dalsi-primesi',
      '/magazin/strana/2',
      // Staré adresy přesměrují redirects z next.config ještě před proxy (ADR-009).
      '/posts',
      '/posts/pisek-biochar-a-dalsi-primesi',
      '/search',
      '/en',
      '/en/magazin/x',
      '/en/posts/x',
      '/nextgen-zavlaha',
      '/apiary',
      '/administrace',
      '/admin-tipy',
      '/next-kroky',
    ]) {
      expect(proxyChyta(cesta), cesta).toBe(true)
    }
  })
})
