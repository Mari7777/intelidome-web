import { describe, expect, it } from 'vitest'
import source from '../../scripts/content/magazine.cs.json'
import moved from '../../src/utilities/magazineMovedAnchors.json'
import { movedArticleAnchor } from '../../src/utilities/magazineMovedAnchors'
import { readingTime } from '../../src/utilities/readingTime'
import { sestavSkupiny } from '../../src/components/Magazin/skladba'
import { LAWN_SERIES_ORDER } from '../../src/components/Magazin/seriesOrder'
import { slugify } from '../../src/utilities/slugify'

// Validate the actual editorial graph, including chapter fragments that HTTP
// status checks cannot detect. This protects links when chapters move again.
const anchors = (content: unknown): Set<string> => {
  const found = new Set(['obsah'])
  const doc = content as { root: { children: { fields?: { title?: string; body?: string; blockType?: string; kind?: string } }[] } }
  for (const { fields: f } of doc.root.children) {
    if (!f) continue
    if (f.title && ['split', 'chapter'].includes(f.blockType ?? '')) found.add(slugify(f.title))
    if (f.blockType === 'calculator') found.add(`kalkulator-${f.kind}`)
    for (const m of (f.body ?? '').matchAll(/^### (.+)$/gm)) found.add(slugify(m[1]))
  }
  return found
}
const destinations = new Map(source.articles.map(a => [`/magazin/${a.slug}`, anchors(a.content)]))
const strings = (value: unknown): string[] => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : []
const assertDestination = (url: string) => {
  const [pathname, fragment] = url.split('#')
  expect(destinations.has(pathname), `Chybí článek ${url}`).toBe(true)
  if (fragment) expect(destinations.get(pathname)?.has(fragment), `Chybí kapitola ${url}`).toBe(true)
}

describe('osm navazujících článků magazínu', () => {
  it('mají úplné samostatné celky kolem deseti minut', () => {
    expect(source.articles).toHaveLength(8)
    for (const a of source.articles) {
      expect(readingTime(a.content)).toBeGreaterThanOrEqual(8)
      expect(readingTime(a.content)).toBeLessThanOrEqual(12)
      for (const slug of a.relatedSlugs) assertDestination(`/magazin/${slug}`)
    }
  })
  it('nově vydaný díl s recepturami řadí před kalkulátor, nezávisle na datu', () => {
    const theme = { id: 1, slug: 'puda-a-zalozeni-travniku', titulek: 'Půda', popis: null, serie: true }
    const articles = [...LAWN_SERIES_ORDER].reverse().map((slug, index) => ({ id: index + 1, slug, kategorie: [1], publishedAt: `2026-10-0${index + 1}T08:00:00Z` }))
    const { skupiny, dily } = sestavSkupiny(articles, [theme])
    expect(skupiny[0].clanky.map(id => articles.find(a => a.id === id)!.slug)).toEqual([...LAWN_SERIES_ORDER])
    expect(dily.get(articles.find(a => a.slug === 'jak-namichat-pudu-pro-travnik')!.id)).toEqual({ k: 3, z: 7 })
  })
  it('FAQ splňují stávající schéma bez jeho změny', () => {
    for (const a of source.articles) for (const n of a.content.root.children) {
      const f = 'fields' in n ? n.fields : undefined
      if (f?.blockType === 'faq' && 'items' in f) {
        expect(f.items?.length).toBeGreaterThanOrEqual(3)
        expect(f.items?.length).toBeLessThanOrEqual(6)
      }
    }
  })
  it('všechny odkazy na články a konkrétní kapitoly mají cíl', () => {
    for (const text of strings(source.articles)) for (const m of text.matchAll(/\/magazin\/[a-z0-9-]+(?:#[a-z0-9-]+)?/g)) assertDestination(m[0])
  })
  it('staré záložky vedou přímo na přesunutou kapitolu bez smyček', () => {
    for (const [old, target] of Object.entries(moved)) {
      assertDestination(target)
      const [pathname, fragment] = old.split('#')
      expect(movedArticleAnchor(pathname, '#' + fragment)).toBe(target)
      expect(movedArticleAnchor('/cs' + pathname, '#' + fragment)).toBe(target)
      expect(movedArticleAnchor(pathname.replace('/magazin/', '/posts/'), '#' + fragment)).toBe(target)
      expect(movedArticleAnchor('/de' + pathname, '#' + fragment)).toBeNull()
      const [newPath, newHash] = target.split('#')
      expect(movedArticleAnchor(newPath, '#' + newHash)).toBeNull()
    }
    expect(movedArticleAnchor('/magazin/jak-zasit-travnik', '#%invalid')).toBeNull()
  })
  it('zachovává kalkulátory a nezveřejňuje smazaný biocharový odstavec', () => {
    const text = JSON.stringify(source)
    expect(text).not.toContain('10.2134/agronj2010.0188')
    expect(text).not.toContain('Kořeny potřebují vedle vody také vzduch, proto více biocharu')
    expect(text).not.toContain('/posts/')
    const kinds = source.articles.flatMap(a => a.content.root.children.flatMap(n => {
      const f = 'fields' in n ? n.fields : undefined
      return f?.blockType === 'calculator' && 'kind' in f ? [f.kind] : []
    }))
    expect(kinds.sort()).toEqual(['prutok', 'pudni-profil', 'vsak'])
  })
})
