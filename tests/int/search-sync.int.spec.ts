// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'

import { beforeSyncWithSearch } from '../../src/search/beforeSync'

const originalDoc = {
  id: 7,
  slug: 'puda',
  title: 'Půda (cs fallback)',
  meta: { title: 'Půda pro trávník', description: 'Český popis', image: { id: 3 } },
  categories: [{ id: 1, title: 'Trávník' }],
}
const searchDoc = { doc: { relationTo: 'posts', value: '7' }, title: 'Půda (cs fallback)' }

const req = (locale: string | undefined, bezFallbacku: unknown, context: Record<string, unknown> = {}) => {
  const findByID = vi.fn(async () => bezFallbacku)
  return { req: { locale, context, payload: { findByID } } as unknown as PayloadRequest, findByID }
}

describe('index hledání zná jazyk (A17)', () => {
  it('cs: beze změny + prelozeno true, žádné druhé čtení', async () => {
    const { req: r, findByID } = req('cs', null)
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.prelozeno).toBe(true)
    expect(vysledek.meta).toMatchObject({ title: 'Půda pro trávník', description: 'Český popis', image: 3 })
    expect(findByID).not.toHaveBeenCalled()
  })

  it('bez jazyka = výchozí cs', async () => {
    const { req: r } = req(undefined, null)
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.prelozeno).toBe(true)
  })

  it('de bez překladu: prelozeno false a meta bez českého fallbacku', async () => {
    const { req: r, findByID } = req('de', { prelozeno: false, title: null, meta: { title: null, description: null } })
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.prelozeno).toBe(false)
    expect(vysledek.meta?.title).toBeUndefined()
    expect(vysledek.meta?.description).toBeUndefined()
    expect(vysledek.meta?.image).toBe(3)
    expect(findByID).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'posts', id: 7, locale: 'de', fallbackLocale: false, select: expect.objectContaining({ prelozeno: true, meta: true }) }),
    )
  })

  it('de s hotovým překladem: prelozeno true a vlastní meta', async () => {
    const { req: r } = req('de', { prelozeno: true, title: 'Boden', meta: { title: 'Boden für Rasen', description: 'Deutsch' } })
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.prelozeno).toBe(true)
    expect(vysledek.meta).toMatchObject({ title: 'Boden für Rasen', description: 'Deutsch' })
  })

  it('Reindex: jazyk ze skipSync (req.context.searchSyncLocale) má přednost před req.locale adminu', async () => {
    const { req: r, findByID } = req('cs', { prelozeno: false, title: null, meta: { title: null, description: null } }, { searchSyncLocale: 'de' })
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.prelozeno).toBe(false)
    expect(vysledek.meta?.title).toBeUndefined()
    expect(vysledek.meta?.description).toBeUndefined()
    expect(findByID).toHaveBeenCalledWith(expect.objectContaining({ locale: 'de', fallbackLocale: false }))
  })

  it('skipSync předá cs → beze změny, žádné druhé čtení', async () => {
    const { req: r, findByID } = req('de', null, { searchSyncLocale: 'cs' })
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.prelozeno).toBe(true)
    expect(findByID).not.toHaveBeenCalled()
  })

  it('de s překladem bez meta titulku bere vlastní title, ne český', async () => {
    const { req: r } = req('de', { prelozeno: true, title: 'Boden', meta: {} })
    const vysledek = await beforeSyncWithSearch({ collectionSlug: 'posts', originalDoc, payload: r.payload, req: r, searchDoc })
    expect(vysledek.meta?.title).toBe('Boden')
  })
})
