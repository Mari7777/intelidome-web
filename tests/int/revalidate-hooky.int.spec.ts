// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))

import { revalidatePath, revalidateTag } from 'next/cache'
import { revalidateDelete, revalidatePost } from '../../src/collections/Posts/hooks/revalidatePost'
import { revalidatePage } from '../../src/collections/Pages/hooks/revalidatePage'

const req = () => ({ payload: { logger: { info: vi.fn() } }, context: {} })
const volane = () => vi.mocked(revalidatePath).mock.calls.map(([cesta]) => cesta)

const tagy = () => vi.mocked(revalidateTag).mock.calls.map(([tag]) => tag)

beforeEach(() => {
  vi.mocked(revalidatePath).mockClear()
  vi.mocked(revalidateTag).mockClear()
})

describe('revalidace po publikaci (A14)', () => {
  it('článek revaliduje /cs/posts/x, nikdy /posts/x', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePost({ doc: { slug: 'x', _status: 'published' }, previousDoc: {}, req: req() } as any)
    expect(volane()).toContain('/cs/posts/x')
    expect(volane()).toContain('/en/posts/x')
    expect(volane()).not.toContain('/posts/x')
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
    expect(volane()).toContain('/cs/posts/stary')
    expect(volane()).not.toContain('/posts/stary')
  })

  it('článek invaliduje posts-sitemap i pages-sitemap (výpis /{l}/posts závisí na článcích, A19)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePost({ doc: { slug: 'x', _status: 'published' }, previousDoc: {}, req: req() } as any)
    expect(tagy()).toEqual(expect.arrayContaining(['posts-sitemap', 'pages-sitemap']))
    vi.mocked(revalidateTag).mockClear()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidateDelete({ doc: { slug: 'x' }, req: req() } as any)
    expect(tagy()).toEqual(expect.arrayContaining(['posts-sitemap', 'pages-sitemap']))
  })
})
