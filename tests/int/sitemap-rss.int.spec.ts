// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getServerSideSitemap } from 'next-sitemap'

import { jazykyDokumentu, jazykyVypisu, sitemapVypisu, sitemapZaznamy } from '../../src/utilities/sitemap'
import { rssXml } from '../../src/utilities/rss'

const ORIGIN = 'https://www.intelidome.com'
const docs = [
  { slug: 'puda', updatedAt: '2026-09-25T08:00:00.000Z', prelozeno: { cs: false, en: true, de: true } },
  { slug: 'pisek', updatedAt: null, prelozeno: { en: false } },
  { slug: null, updatedAt: '2026-09-25T08:00:00.000Z', prelozeno: { en: true } },
]

describe('sitemapy po jazycích (A19)', () => {
  it('jazykyDokumentu: cs vždy, ostatní jen prelozeno === true ∩ živé', () => {
    expect(jazykyDokumentu({ en: true, de: true }, ['cs'])).toEqual(['cs'])
    expect(jazykyDokumentu({ en: true, de: true }, ['cs', 'de'])).toEqual(['cs', 'de'])
    expect(jazykyDokumentu({ en: 'ano' }, ['cs', 'en'])).toEqual(['cs'])
    expect(jazykyDokumentu(true, ['cs', 'en'])).toEqual(['cs'])
    expect(jazykyDokumentu(undefined, ['cs', 'en'])).toEqual(['cs'])
  })

  it('jediný živý jazyk = dnešní záznamy bez xhtml:link', async () => {
    const zaznamy = sitemapZaznamy('posts', docs, ORIGIN, ['cs'])
    expect(zaznamy).toEqual([
      { loc: `${ORIGIN}/magazin/puda`, lastmod: '2026-09-25T08:00:00.000Z' },
      { loc: `${ORIGIN}/magazin/pisek` },
    ])
    expect(sitemapZaznamy('pages', [{ slug: 'home', updatedAt: 'X' }, { slug: 'o-nas' }], ORIGIN, ['cs'])).toEqual([
      { loc: `${ORIGIN}/`, lastmod: 'X' },
      { loc: `${ORIGIN}/o-nas` },
    ])
    const xml = await (await getServerSideSitemap(zaznamy)).text()
    expect(xml).not.toContain('<xhtml:link')
    expect(xml).toContain(`<url><loc>${ORIGIN}/magazin/puda</loc><lastmod>2026-09-25T08:00:00.000Z</lastmod></url>`)
    expect(sitemapVypisu(docs, ORIGIN, ['cs'])).toEqual([{ loc: `${ORIGIN}/magazin` }])
  })

  it('dva živé jazyky: záznam pro každý, reciproční hreflang z jedné množiny + x-default', async () => {
    const zaznamy = sitemapZaznamy('posts', docs, ORIGIN, ['cs', 'de'])
    const alternates = [
      { href: `${ORIGIN}/magazin/puda`, hreflang: 'cs' },
      { href: `${ORIGIN}/de/magazin/puda`, hreflang: 'de' },
      { href: `${ORIGIN}/magazin/puda`, hreflang: 'x-default' },
    ]
    expect(zaznamy).toEqual([
      { loc: `${ORIGIN}/magazin/puda`, lastmod: '2026-09-25T08:00:00.000Z', alternateRefs: alternates },
      { loc: `${ORIGIN}/de/magazin/puda`, lastmod: '2026-09-25T08:00:00.000Z', alternateRefs: alternates },
      { loc: `${ORIGIN}/magazin/pisek` },
    ])
    const xml = await (await getServerSideSitemap(zaznamy)).text()
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    expect(xml.match(/<xhtml:link rel="alternate" hreflang="x-default" href="https:\/\/www\.intelidome\.com\/magazin\/puda"\/>/g)).toHaveLength(2)
    expect(xml).toContain(`<url><loc>${ORIGIN}/magazin/pisek</loc></url>`)
  })

  it('výpis /magazin existuje v cizím jazyce jen s ≥ 1 přeloženým článkem', () => {
    expect(jazykyVypisu(docs, ['cs', 'en', 'de'])).toEqual(['cs', 'en', 'de'])
    expect(jazykyVypisu([docs[1]], ['cs', 'en', 'de'])).toEqual(['cs'])
    expect(sitemapVypisu(docs, ORIGIN, ['cs', 'en'])).toEqual([
      { loc: `${ORIGIN}/magazin`, alternateRefs: [
        { href: `${ORIGIN}/magazin`, hreflang: 'cs' }, { href: `${ORIGIN}/en/magazin`, hreflang: 'en' }, { href: `${ORIGIN}/magazin`, hreflang: 'x-default' },
      ] },
      { loc: `${ORIGIN}/en/magazin`, alternateRefs: [
        { href: `${ORIGIN}/magazin`, hreflang: 'cs' }, { href: `${ORIGIN}/en/magazin`, hreflang: 'en' }, { href: `${ORIGIN}/magazin`, hreflang: 'x-default' },
      ] },
    ])
  })
})

describe('RSS generátor (A19)', () => {
  const posts = [
    { title: 'Půda & <trávník>', slug: 'puda', publishedAt: '2026-09-12T08:00:00.000Z', meta: { description: 'Jak "připravit" půdu.' } },
    { title: 'Bez data', slug: 'pisek', publishedAt: null, meta: null },
  ]

  it('cs kanál = původní podoba (link origin, self /feed.xml, language cs, escapování)', () => {
    const xml = rssXml({ siteUrl: ORIGIN, locale: 'cs', posts })
    expect(xml).toContain(`<link>${ORIGIN}</link>`)
    expect(xml).toContain(`<atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />`)
    expect(xml).toContain('<language>cs</language>')
    expect(xml).toContain('<title>Půda &amp; &lt;trávník&gt;</title>')
    expect(xml).toContain('<description>Jak &quot;připravit&quot; půdu.</description>')
    expect(xml).toContain(`<guid isPermaLink="true">${ORIGIN}/magazin/puda</guid>`)
    expect(xml).toContain('<pubDate>Sat, 12 Sep 2026 08:00:00 GMT</pubDate>')
    expect(xml).toBe(rssXml({ siteUrl: ORIGIN, posts }))
    expect(xml).not.toContain('/cs/')
  })

  it('en kanál: link, self a položky s prefixem, language en', () => {
    const xml = rssXml({ siteUrl: ORIGIN, locale: 'en', posts })
    expect(xml).toContain(`<link>${ORIGIN}/en</link>`)
    expect(xml).toContain(`<atom:link href="${ORIGIN}/en/feed.xml" rel="self" type="application/rss+xml" />`)
    expect(xml).toContain('<language>en</language>')
    expect(xml).toContain(`<link>${ORIGIN}/en/magazin/puda</link>`)
    expect(xml).toContain(`<guid isPermaLink="true">${ORIGIN}/en/magazin/pisek</guid>`)
  })
})
