// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))

import { revalidatePath, revalidateTag } from 'next/cache'
import { revalidateDelete, revalidatePost } from '../../src/collections/Posts/hooks/revalidatePost'
import { revalidatePage } from '../../src/collections/Pages/hooks/revalidatePage'
import { revalidateMagazinPoKategorii, revalidateMagazinPoSmazaniKategorie } from '../../src/hooks/revalidateMagazin'

const req = () => ({ payload: { logger: { info: vi.fn() } }, context: {} })
const volane = () => vi.mocked(revalidatePath).mock.calls.map(([cesta]) => cesta)

const tagy = () => vi.mocked(revalidateTag).mock.calls.map(([tag]) => tag)

beforeEach(() => {
  vi.mocked(revalidatePath).mockClear()
  vi.mocked(revalidateTag).mockClear()
})

describe('revalidace po publikaci (A14)', () => {
  it('článek revaliduje /cs/magazin/x, nikdy /magazin/x', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePost({ doc: { slug: 'x', _status: 'published' }, previousDoc: {}, req: req() } as any)
    expect(volane()).toContain('/cs/magazin/x')
    expect(volane()).toContain('/en/magazin/x')
    expect(volane()).not.toContain('/magazin/x')
    // S článkem i domovská stránka magazínu a RSS (ADR-009), jinak ISR až 600 s.
    expect(volane()).toContain('/cs/magazin')
    expect(volane()).toContain('/feed.xml')
  })

  it('home revaliduje /cs, nikdy /', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePage({ doc: { slug: 'home', _status: 'published' }, previousDoc: {}, req: req() } as any)
    expect(volane()).toContain('/cs')
    expect(volane()).not.toContain('/')
  })

  it('při odpublikování revaliduje i starý slug', () => {
    revalidatePost({
      doc: { slug: 'novy', _status: 'draft' },
      previousDoc: { slug: 'stary', _status: 'published' },
      req: req(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    expect(volane()).toContain('/cs/magazin/stary')
    expect(volane()).not.toContain('/magazin/stary')
  })

  it('článek invaliduje posts-sitemap i pages-sitemap (výpis /{l}/magazin závisí na článcích, A19)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePost({ doc: { slug: 'x', _status: 'published' }, previousDoc: {}, req: req() } as any)
    expect(tagy()).toEqual(expect.arrayContaining(['posts-sitemap', 'pages-sitemap']))
    vi.mocked(revalidateTag).mockClear()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidateDelete({ doc: { slug: 'x' }, req: req() } as any)
    expect(tagy()).toEqual(expect.arrayContaining(['posts-sitemap', 'pages-sitemap']))
  })

  it('změna tématu (kategorie) revaliduje celý podstrom magazínu a úvod (DESIGN 8.5)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidateMagazinPoKategorii({ doc: {}, req: req() } as any)
    const volani = vi.mocked(revalidatePath).mock.calls
    expect(volani).toEqual(expect.arrayContaining([['/cs/magazin', 'layout'], ['/en/magazin', 'layout']]))
    expect(volane()).toContain('/cs')
    vi.mocked(revalidatePath).mockClear()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidateMagazinPoSmazaniKategorie({ doc: {}, req: { ...req(), context: { disableRevalidate: true } } } as any)
    expect(volane()).toEqual([])
  })
})
