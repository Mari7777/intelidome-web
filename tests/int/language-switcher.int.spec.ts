// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from '../../src/components/LanguageSwitcher'
import { LocaleProvider } from '../../src/i18n/LocaleProvider'
import type { Locale } from '../../src/i18n/config'

const cesta = { hodnota: '/magazin/x' }
vi.mock('next/navigation', () => ({ usePathname: () => cesta.hodnota }))

const vykresli = (liveLocales: Locale[], varianta: 'hlavicka' | 'paticka', locale: Locale = 'cs') =>
  renderToStaticMarkup(
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(LanguageSwitcher, { liveLocales, varianta }),
    }),
  )

describe('LanguageSwitcher (A20)', () => {
  it('při jediném živém jazyce nevykreslí nic (dnešní DOM, zlatý snímek)', () => {
    expect(vykresli(['cs'], 'hlavicka')).toBe('')
    expect(vykresli(['cs'], 'paticka')).toBe('')
  })

  /** Značka `<a …>` podle `lang`; aserce jdou po vlastnostech, ne po přesném pořadí tříd. */
  const odkaz = (html: string, lang: Locale): string => {
    const m = html.match(new RegExp(`<a [^>]*lang="${lang}"[^>]*>[^<]*</a>`))
    expect(m, `chybí odkaz lang="${lang}"`).not.toBeNull()
    return m![0]
  }

  it('hlavička: položky .id-capsule__link, aktuální aria-current, lang, bez hreflang', () => {
    const html = vykresli(['cs', 'de'], 'hlavicka')
    const cs = odkaz(html, 'cs')
    const de = odkaz(html, 'de')
    expect(cs).toContain('aria-current="true"')
    expect(cs).toContain('id-capsule__link')
    expect(cs).toContain('href="/magazin/x"')
    expect(cs).toMatch(/>cs<\/a>$/)
    expect(de).not.toContain('aria-current')
    expect(de).toContain('id-capsule__link')
    expect(de).toContain('href="/de/magazin/x"')
    expect(de).toMatch(/>de<\/a>$/)
    expect(html).not.toContain('hreflang')
    expect(html).not.toContain('<nav')
    expect(html.match(/<a /g)?.length).toBe(2)
  })

  it('patička: nav s aria-label, odkaz z cesty bez prefixu (de → cs)', () => {
    cesta.hodnota = '/de/magazin/x'
    const html = vykresli(['cs', 'de', 'en'], 'paticka', 'de')
    expect(html).toContain('aria-label="Přepínač jazyků"')
    expect(html.match(/<a /g)?.length).toBe(3)
    const cs = odkaz(html, 'cs')
    const de = odkaz(html, 'de')
    const en = odkaz(html, 'en')
    expect(cs).toContain('href="/magazin/x"')
    expect(cs).not.toContain('aria-current')
    expect(cs).not.toContain('id-capsule__link')
    expect(de).toContain('aria-current="true"')
    expect(de).toContain('href="/de/magazin/x"')
    expect(en).toContain('href="/en/magazin/x"')
    expect(en).not.toContain('aria-current')
    expect(html).not.toContain('hreflang')
    cesta.hodnota = '/magazin/x'
  })
})
