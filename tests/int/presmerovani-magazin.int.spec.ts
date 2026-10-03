import { describe, expect, it } from 'vitest'
// @ts-expect-error -- Next přibaluje path-to-regexp bez typů; je to týž kód, kterým vyhodnocuje redirects.
import { compile, match } from 'next/dist/compiled/path-to-regexp'

import { presmerovaniMagazinu } from '../../redirects'

/** Napodobí vyhodnocení redirects v Nextu: první shoda vyhrává, parametry se dosadí do cíle. */
const kam = (cesta: string): string | null => {
  for (const { source, destination } of presmerovaniMagazinu()) {
    const shoda = match(source, { decode: decodeURIComponent })(cesta)
    if (shoda) return compile(destination, { encode: encodeURIComponent })(shoda.params as object)
  }
  return null
}

describe('trvalá přesměrování starých adres na magazín (ADR-009)', () => {
  it('všechna jsou trvalá (308)', () => {
    expect(presmerovaniMagazinu().every((p) => p.permanent === true)).toBe(true)
  })

  it.each([
    ['/posts', '/magazin'],
    ['/posts/jak-zasit-travnik', '/magazin/jak-zasit-travnik'],
    ['/posts/page/1', '/magazin'],
    ['/posts/page/2', '/magazin/strana/2'],
    ['/magazin/strana/1', '/magazin'],
    ['/cs/posts', '/magazin'],
    ['/cs/posts/jak-zasit-travnik', '/magazin/jak-zasit-travnik'],
    ['/cs/posts/page/3', '/magazin/strana/3'],
    ['/en/posts', '/en/magazin'],
    ['/en/posts/jak-zasit-travnik', '/en/magazin/jak-zasit-travnik'],
    ['/de/posts/page/2', '/de/magazin/strana/2'],
    ['/de/magazin/strana/1', '/de/magazin'],
  ])('%s → %s jedním skokem', (stara, nova) => {
    expect(kam(stara)).toBe(nova)
    // Cíl je konečný: žádný druhý skok v pravidlech magazínu.
    expect(kam(nova)).toBeNull()
  })

  it.each([
    '/posts-sitemap.xml',
    '/api/posts',
    '/api/posts/1',
    '/postsx',
    '/admin/collections/posts',
    '/magazin',
    '/magazin/jak-zasit-travnik',
    '/magazin/strana/2',
    '/en/magazin/x',
    '/xx/posts/x',
  ])('%s se nepřesměrovává', (cesta) => {
    expect(kam(cesta)).toBeNull()
  })
})
