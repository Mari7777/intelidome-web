// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { LOCALES } from '../../src/i18n/config'
import { interniCesty, lokalizujCestu, odstranPrefix, verejnaCesta } from '../../src/i18n/routing'

describe('lokalizujCestu', () => {
  it('nechává externí, kotvy, `//` a prázdný řetězec', () => {
    for (const href of ['https://example.com/x', 'mailto:a@b.cz', 'tel:+420', '#obsah', '//cdn.x/y', '']) {
      expect(lokalizujCestu(href, 'en')).toBe(href)
    }
  })

  it('nechává /api, /admin, /next, /_next, /_vercel a soubory s příponou', () => {
    for (const href of ['/api/media/x', '/admin', '/next/preview?path=/x', '/_next/static/a.js', '/_vercel/insights', '/x.png', '/feed.xml']) {
      expect(lokalizujCestu(href, 'en')).toBe(href)
    }
  })

  it('je idempotentní a pro cs beze změny', () => {
    expect(lokalizujCestu('/en/posts/x', 'en')).toBe('/en/posts/x')
    expect(lokalizujCestu('/de', 'en')).toBe('/de')
    expect(lokalizujCestu('/posts/x', 'cs')).toBe('/posts/x')
    expect(lokalizujCestu('/', 'cs')).toBe('/')
    // `/enx` není jazyk
    expect(lokalizujCestu('/enx', 'de')).toBe('/de/enx')
  })

  it('prefixuje a zachová query i hash', () => {
    expect(lokalizujCestu('/', 'en')).toBe('/en')
    expect(lokalizujCestu('/posts/x?a=1#k', 'en')).toBe('/en/posts/x?a=1#k')
    expect(lokalizujCestu('/search?q=puda', 'de')).toBe('/de/search?q=puda')
  })
})

describe('odstranPrefix', () => {
  it('rozpozná prefix a vrátí cestu bez něj', () => {
    expect(odstranPrefix('/en/posts/x')).toEqual({ locale: 'en', path: '/posts/x' })
    expect(odstranPrefix('/en')).toEqual({ locale: 'en', path: '/' })
    expect(odstranPrefix('/posts/x')).toEqual({ locale: 'cs', path: '/posts/x' })
    expect(odstranPrefix('/enx')).toEqual({ locale: 'cs', path: '/enx' })
    expect(odstranPrefix('/')).toEqual({ locale: 'cs', path: '/' })
  })
})

describe('interniCesty', () => {
  it('vrací cestu route stromu pro každý jazyk, vždy i /cs', () => {
    const posts = interniCesty('posts', 'x')
    expect(posts).toHaveLength(LOCALES.length)
    expect(posts).toContain('/cs/posts/x')
    expect(posts).toContain('/en/posts/x')
    expect(posts).not.toContain('/posts/x')

    expect(interniCesty('pages', 'home')).toContain('/cs')
    expect(interniCesty('pages', 'home')).not.toContain('/')
    expect(interniCesty('pages', 'o-nas')).toContain('/de/o-nas')
  })
})

describe('verejnaCesta', () => {
  it('skládá veřejnou adresu dokumentu', () => {
    expect(verejnaCesta('posts', 'x', 'cs')).toBe('/posts/x')
    expect(verejnaCesta('posts', 'x', 'en')).toBe('/en/posts/x')
    expect(verejnaCesta('pages', 'home', 'cs')).toBe('/')
    expect(verejnaCesta('pages', 'home', 'en')).toBe('/en')
    expect(verejnaCesta('pages', 'o-nas', 'de')).toBe('/de/o-nas')
  })
})
