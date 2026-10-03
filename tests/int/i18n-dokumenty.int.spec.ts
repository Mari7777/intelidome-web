// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { getPayload, type Payload } from 'payload'

/* Živé jazyky natvrdo cs + de: bez toho by `prekladyDokumentu` vracelo
   vždy `['cs']` (průnik s LIVE_LOCALES) a test by nic neprokázal. */
vi.mock('../../src/i18n/live', () => ({ LIVE_LOCALES: ['cs', 'de'] }))

import config from '@payload-config'
import {
  najdiDokument,
  prekladyDokumentu,
  rozhodniDokument,
  zobrazitelny,
} from '../../src/i18n/dokumenty'

let payload: Payload
let slug: string
let id: number

const digest = (fn: () => void): string => {
  try {
    fn()
  } catch (e) {
    return String((e as { digest?: string }).digest ?? e)
  }
  return 'nic'
}

describe('dokumenty a jazyk (A4–A6)', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1,
      locale: 'cs',
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
      sort: 'createdAt',
    })
    expect(docs.length, 'dev DB potřebuje aspoň jeden publikovaný článek').toBe(1)
    slug = docs[0].slug
    id = docs[0].id
  })

  it('zobrazitelny: čeština vždy, jiný jazyk jen s hotovým překladem', () => {
    expect(zobrazitelny({ prelozeno: false }, 'cs')).toBe(true)
    expect(zobrazitelny(null, 'cs')).toBe(true)
    expect(zobrazitelny({ prelozeno: true }, 'de')).toBe(true)
    expect(zobrazitelny({ prelozeno: false }, 'de')).toBe(false)
    expect(zobrazitelny({}, 'de')).toBe(false)
    expect(zobrazitelny(undefined, 'de')).toBe(false)
  })

  it('rozhodniDokument: chybí → 404, nepřeložený → 307 na cs, náhled projde, cs projde', () => {
    expect(digest(() => rozhodniDokument({ doc: null, locale: 'de', draft: false, csCesta: '/magazin/x' }))).toMatch(/404/)
    expect(
      digest(() => rozhodniDokument({ doc: { prelozeno: false }, locale: 'de', draft: false, csCesta: '/magazin/x' })),
    ).toMatch(/NEXT_REDIRECT;replace;\/magazin\/x;307/)
    expect(digest(() => rozhodniDokument({ doc: { prelozeno: false }, locale: 'de', draft: true, csCesta: '/magazin/x' }))).toBe('nic')
    expect(digest(() => rozhodniDokument({ doc: { prelozeno: true }, locale: 'de', draft: false, csCesta: '/magazin/x' }))).toBe('nic')
    expect(digest(() => rozhodniDokument({ doc: { prelozeno: false }, locale: 'cs', draft: false, csCesta: '/magazin/x' }))).toBe('nic')
  })

  it('najdiDokument vrátí český článek, neexistující slug → null', async () => {
    const post = await najdiDokument({ collection: 'posts', slug, locale: 'cs', draft: false })
    expect(post?.slug).toBe(slug)
    expect(post?.title).toBeTruthy()
    expect(await najdiDokument({ collection: 'posts', slug: 'neexistuje-' + Date.now(), locale: 'cs', draft: false })).toBeNull()
    // Cizí jazyk s fallbackem: dokument existuje (česky), o viditelnosti rozhoduje `prelozeno`.
    const de = await najdiDokument({ collection: 'posts', slug, locale: 'de', draft: false })
    expect(de?.slug).toBe(slug)
    expect(zobrazitelny(de, 'de')).toBe(false)
  })

  it('prekladyDokumentu: nepřeložený článek → jen cs; neexistující → jen cs', async () => {
    expect(await prekladyDokumentu('posts', slug)).toEqual(['cs'])
    expect(await prekladyDokumentu('posts', 'neexistuje-' + Date.now())).toEqual(['cs'])
  })

  describe('rozpracovaný překlad (draft) nemění veřejné jazyky', () => {
    let verzePred: number
    let start: string
    let vhodny = true

    beforeAll(async () => {
      /* Draft se ukládá jen do verzí (hlavní tabulka zůstává), úklid = smazat
         verze vzniklé během testu. U dokumentu na stropu `maxPerDoc` (50) by
         nový draft vytlačil nejstarší verzi nevratně → takový přeskočíme. */
      const kandidati = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 20,
        locale: 'cs',
        overrideAccess: false,
        pagination: false,
        select: { slug: true },
      })
      let min = Infinity
      for (const kandidat of kandidati.docs) {
        const { totalDocs } = await payload.countVersions({ collection: 'posts', where: { parent: { equals: kandidat.id } } })
        if (totalDocs < min) {
          min = totalDocs
          id = kandidat.id
          slug = kandidat.slug
        }
      }
      verzePred = min
      vhodny = min <= 45
      start = new Date().toISOString()
    })

    afterAll(async () => {
      if (!vhodny) return
      await payload.db.deleteVersions({
        collection: 'posts',
        where: { and: [{ parent: { equals: id } }, { createdAt: { greater_than: start } }] },
      })
      const { totalDocs } = await payload.countVersions({ collection: 'posts', where: { parent: { equals: id } } })
      expect(totalDocs, 'úklid verzí').toBe(verzePred)
    })

    it('de draft s prelozeno=true → publikované překlady stále jen cs', async () => {
      if (!vhodny) {
        console.warn('všechny články mají ≥ 46 verzí, mutační část testu přeskočena')
        return
      }
      await payload.update({
        collection: 'posts',
        id,
        locale: 'de',
        draft: true,
        data: { title: 'TEST de', prelozeno: true },
        context: { disableRevalidate: true },
      })
      const draft = await najdiDokument({ collection: 'posts', slug, locale: 'de', draft: true })
      expect(draft?.title).toBe('TEST de')
      expect(zobrazitelny(draft, 'de')).toBe(true)

      // Veřejně (draft: false) zůstává jen čeština — v obou čteních.
      const verejny = await najdiDokument({ collection: 'posts', slug, locale: 'de', draft: false })
      expect(zobrazitelny(verejny, 'de')).toBe(false)
      expect(await prekladyDokumentu('posts', slug)).toEqual(['cs'])
      const cerstve = await payload.find({
        collection: 'posts',
        draft: false,
        fallbackLocale: false,
        limit: 1,
        locale: 'all',
        overrideAccess: false,
        pagination: false,
        select: { prelozeno: true },
        where: { slug: { equals: slug } },
      })
      const mapa = cerstve.docs[0]?.prelozeno as unknown as Record<string, boolean>
      expect(mapa?.de ?? false).toBe(false)
    })
  })
})
