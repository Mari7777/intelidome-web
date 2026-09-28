// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Post } from '../../src/payload-types'
import { absoluteSiteURL, getServerSideURL } from '../../src/utilities/getURL'
import { generateMeta } from '../../src/utilities/generateMeta'
import { articleJsonLd, getArticleSections } from '../../src/utilities/articleSeo'

const post = {
  title: 'Půda: praktický průvodce', slug: 'puda',
  publishedAt: '2026-09-12T08:00:00.000Z', updatedAt: '2026-09-25T08:00:00.000Z',
  meta: { title: 'Půda pro trávník | InteliDome', description: 'Jak připravit půdu.' },
  heroImage: { url: 'https://storage.example/hero.avif', width: 1920, height: 1080, alt: 'Půdní sonda' },
  populatedAuthors: [], categories: [],
  content: { root: { children: [
    { type: 'block', fields: { blockType: 'chapter', title: 'Jak poznat půdu?' } },
    { type: 'block', fields: { blockType: 'split', title: 'Výběr písku', titleLevel: 'h3' } },
    { type: 'block', fields: { blockType: 'split', body: 'Pokračování bez titulku.' } },
  ] } },
} as unknown as Post

afterEach(() => vi.unstubAllEnvs())

describe('published article SEO', () => {
  it('keeps canonical origins consistent across dev, production and Vercel', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '')
    vi.stubEnv('NODE_ENV', 'production')
    expect(getServerSideURL()).toBe('https://www.intelidome.com')
    vi.stubEnv('NODE_ENV', 'development')
    expect(getServerSideURL()).toBe('http://localhost:3100')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'intelidome.vercel.app/')
    expect(getServerSideURL()).toBe('https://intelidome.vercel.app')
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com/subpath/')
    expect(getServerSideURL()).toBe('https://www.intelidome.com')
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'ftp://example.com')
    expect(() => getServerSideURL()).toThrow('HTTP or HTTPS')
  })

  it('preserves absolute CDN image URLs and resolves local image URLs', async () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    expect(absoluteSiteURL('/media/puda.avif')).toBe('https://www.intelidome.com/media/puda.avif')
    const metadata = await generateMeta({ doc: post, collection: 'posts' })
    expect(metadata.title).toBe('Půda pro trávník')
    expect(metadata.alternates).toMatchObject({ canonical: '/posts/puda', types: { 'application/rss+xml': '/feed.xml' } })
    expect(metadata.openGraph).toMatchObject({ type: 'article', publishedTime: post.publishedAt, modifiedTime: post.updatedAt, locale: 'cs_CZ' })
    expect(metadata.openGraph?.images).toEqual([{ url: 'https://storage.example/hero.avif', width: 1920, height: 1080, alt: 'Půdní sonda' }])
    expect((await generateMeta({ doc: { slug: 'home' }, collection: 'pages' })).alternates?.canonical).toBe('/')
    const page = await generateMeta({ doc: { ...post, slug: 'o-nas' }, collection: 'pages' })
    expect(page.alternates?.canonical).toBe('/o-nas')
    expect(page.openGraph).toMatchObject({ type: 'website' })
  })

  it('uses existing section anchors and truthful organization authorship', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    expect(getArticleSections(post.content)).toEqual([{ title: 'Jak poznat půdu?', id: 'jak-poznat-pudu' }])
    const graph = articleJsonLd(post)['@graph']
    expect(graph[0]).toMatchObject({
      '@type': 'BlogPosting', url: 'https://www.intelidome.com/posts/puda',
      author: { '@type': 'Organization', name: 'InteliDome' },
      image: [{ url: 'https://storage.example/hero.avif' }],
      hasPart: [{ url: 'https://www.intelidome.com/posts/puda#jak-poznat-pudu' }],
    })
    expect(graph[2]).toMatchObject({ '@type': 'BreadcrumbList', itemListElement: [{ position: 1 }, { position: 2 }, { position: 3 }] })
    expect(JSON.stringify(graph)).not.toContain('localhost')
  })
})

describe('SEO po jazycích (A19)', () => {
  it('en s překlady cs+en: canonical, RSS, hreflang vč. x-default, OG locale', async () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    const metadata = await generateMeta({ doc: post, collection: 'posts', locale: 'en', preklady: ['cs', 'en'] })
    expect(metadata.alternates).toEqual({
      canonical: '/en/posts/puda',
      languages: { cs: '/posts/puda', en: '/en/posts/puda', 'x-default': '/posts/puda' },
      types: { 'application/rss+xml': '/en/feed.xml' },
    })
    expect(Object.keys((metadata.alternates?.languages ?? {}) as object)).toEqual(['cs', 'en', 'x-default'])
    expect(metadata.openGraph).toMatchObject({ url: '/en/posts/puda', locale: 'en_GB', alternateLocale: ['cs_CZ'] })
  })

  it('en bez druhého jazyka: canonical /en/…, žádný hreflang ani alternateLocale', async () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    const metadata = await generateMeta({ doc: post, collection: 'posts', locale: 'en', preklady: ['cs'] })
    expect(metadata.alternates).toEqual({ canonical: '/en/posts/puda', types: { 'application/rss+xml': '/en/feed.xml' } })
    expect(metadata.openGraph).toMatchObject({ locale: 'en_GB' })
    expect(metadata.openGraph).not.toHaveProperty('alternateLocale')
    const home = await generateMeta({ doc: { slug: 'home' }, collection: 'pages', locale: 'en', preklady: ['cs', 'en', 'de'] })
    expect(home.alternates).toMatchObject({ canonical: '/en', languages: { cs: '/', en: '/en', de: '/de', 'x-default': '/' } })
    expect(home.openGraph).toMatchObject({ alternateLocale: ['cs_CZ', 'de_DE'] })
  })

  it('cs bez uvedení jazyka = dnešní výstup (žádné languages, RSS /feed.xml)', async () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    const metadata = await generateMeta({ doc: post, collection: 'posts' })
    expect(metadata.alternates).toEqual({ canonical: '/posts/puda', types: { 'application/rss+xml': '/feed.xml' } })
    expect(metadata.openGraph).not.toHaveProperty('alternateLocale')
    expect(JSON.stringify(articleJsonLd(post))).toBe(JSON.stringify(articleJsonLd(post, { locale: 'cs', preklady: ['cs'] })))
  })

  it('locale mimo preklady (náhled nepřeloženého jazyka): žádný hreflang, alternateLocale ani vazba překladu', async () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    const metadata = await generateMeta({ doc: post, collection: 'posts', locale: 'de', preklady: ['cs', 'en'] })
    expect(metadata.alternates).toEqual({ canonical: '/de/posts/puda', types: { 'application/rss+xml': '/de/feed.xml' } })
    expect(metadata.openGraph).not.toHaveProperty('alternateLocale')
    const graph = articleJsonLd(post, { locale: 'de', preklady: ['cs', 'en'] })['@graph'][0]
    expect(graph).not.toHaveProperty('workTranslation')
    expect(graph).not.toHaveProperty('translationOfWork')
  })

  it('JSON-LD cs s překladem: workTranslation na en', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    const graph = articleJsonLd(post, { locale: 'cs', preklady: ['cs', 'en'] })['@graph'][0]
    expect(graph).toMatchObject({
      url: 'https://www.intelidome.com/posts/puda',
      workTranslation: [{ '@id': 'https://www.intelidome.com/en/posts/puda#article', url: 'https://www.intelidome.com/en/posts/puda', inLanguage: 'en' }],
    })
    expect(graph).not.toHaveProperty('translationOfWork')
  })

  it('JSON-LD en: url, @id, inLanguage, lokalizovaná drobenka, translationOfWork na cs', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.intelidome.com')
    const graph = articleJsonLd(post, { locale: 'en', preklady: ['cs', 'en'] })['@graph']
    expect(graph[0]).toMatchObject({
      '@id': 'https://www.intelidome.com/en/posts/puda#article',
      url: 'https://www.intelidome.com/en/posts/puda',
      inLanguage: 'en',
      mainEntityOfPage: { '@id': 'https://www.intelidome.com/en/posts/puda' },
      hasPart: [{ url: 'https://www.intelidome.com/en/posts/puda#jak-poznat-pudu' }],
      publisher: { '@id': 'https://www.intelidome.com/#organization' },
      translationOfWork: { '@id': 'https://www.intelidome.com/posts/puda#article', url: 'https://www.intelidome.com/posts/puda', inLanguage: 'cs' },
    })
    expect(graph[0]).not.toHaveProperty('workTranslation')
    expect(graph[1]).toMatchObject({ '@id': 'https://www.intelidome.com/#organization' })
    expect(graph[2]).toMatchObject({
      '@id': 'https://www.intelidome.com/en/posts/puda#breadcrumbs',
      itemListElement: [
        { position: 1, item: 'https://www.intelidome.com/en' },
        { position: 2, item: 'https://www.intelidome.com/en/posts' },
        { position: 3, item: 'https://www.intelidome.com/en/posts/puda' },
      ],
    })
    const jen = articleJsonLd(post, { locale: 'en', preklady: ['cs'] })['@graph'][0]
    expect(jen).not.toHaveProperty('workTranslation')
    expect(jen).not.toHaveProperty('translationOfWork')
  })
})
