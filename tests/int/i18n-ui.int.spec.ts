// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { LOCALES } from '../../src/i18n/config'
import { t, type Slovnik } from '../../src/i18n/ui'
import { formatAuthors, formatSeznam } from '../../src/utilities/formatAuthors'
import { formatDateTime } from '../../src/utilities/formatDateTime'
import { formatFigureNumber } from '../../src/utilities/formatFigureNumber'

describe('slovník UI (A11)', () => {
  it('čeština je zdroj: t(cs, key) vrací český řetězec', () => {
    expect(t('cs', 'nav.aria')).toBe('Hlavní navigace')
    expect(t('cs', 'nav.cta')).toBe('Objevit systém')
    // pevná mezera (HEAD `a&nbsp;odpovědi`) — zapsána explicitně, aby ji editor tiše nenormalizoval
    expect(t('cs', 'faq.eyebrow')).toBe('Otázky a\u00a0odpovědi')
    expect(t('cs', 'faq.eyebrow').charCodeAt(8)).toBe(0xa0)
    expect(t('cs', 'seo.siteTitle')).toBe('InteliDome — chytrá závlaha a automatizace zahrady')
  })

  it('jazyk bez překladu padá na češtinu (všechny jazyky, každý klíč)', () => {
    for (const locale of LOCALES) {
      expect(t(locale, 'nav.aria')).toBe('Hlavní navigace')
      expect(t(locale, 'search.empty')).toBe('Nic jsme nenašli.')
    }
    expect(t('de', 'related.heading')).toBe(t('cs', 'related.heading'))
  })

  it('překlad jiného jazyka je typově zapsatelný (Partial<Slovnik>, ne české literály)', () => {
    // Typová pojistka: kdyby se slovník vrátil k `as const`, tsc tu spadne (TS2322).
    const en: Partial<Slovnik> = {
      'nav.aria': 'Main navigation',
      'hero.reading': (m) => `${m} min read`,
    }
    const nav: string = t('cs', 'nav.aria')
    expect(en['nav.aria']).toBe('Main navigation')
    expect(en['hero.reading']?.(3)).toBe('3 min read')
    expect(nav).toBe('Hlavní navigace')
  })

  it('hodnoty-funkce dávají české tvary', () => {
    expect(t('cs', 'hero.reading')(7)).toBe('7 min čtení')
    expect(t('cs', 'hero.calculators')(1)).toBe('1 kalkulátor')
    expect(t('cs', 'hero.calculators')(3)).toBe('3 kalkulátory')
    expect(t('cs', 'hero.calculators')(5)).toBe('5 kalkulátorů')
    expect(t('en', 'hero.calculators')(2)).toBe('2 kalkulátory')
    expect(t('cs', 'pageRange.posts')(1)).toBe('článek')
    expect(t('cs', 'pageRange.posts')(4)).toBe('články')
    expect(t('cs', 'pageRange.posts')(12)).toBe('článků')
    expect(t('cs', 'pageRange.shown')(1, 12, 30, 'článků')).toBe('Zobrazeno 1–12 z 30 článků')
    expect(t('cs', 'pageRange.shown')(0, 0, 3, 'články')).toBe('Zobrazeno 0 z 3 články')
    expect(t('cs', 'posts.page')('2')).toBe('Články — strana 2')
    expect(t('cs', 'ingredients.item')(3)).toBe('Složka 3')
    expect(t('cs', 'productBand.figureAlt')('čidlo vlhkosti, ventil a retenční nádrž')).toBe(
      'Schéma sítě: most uprostřed, kolem něj čidlo vlhkosti, ventil a retenční nádrž; aktivní spoj vede k ventilu.',
    )
  })
})

describe('formatDateTime (A12)', () => {
  /* Původní ruční skládání `${d}. ${m}. ${y}` — cs musí zůstat byte-identické. */
  const rucne = (ts: string) => {
    const d = new Date(ts)
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
  }

  it('cs dává přesně původní zápis pro 3 data', () => {
    for (const ts of ['2026-08-19T10:00:00.000Z', '2026-01-05T12:00:00.000Z', '2025-12-31T12:00:00.000Z']) {
      expect(formatDateTime(ts)).toBe(rucne(ts))
      expect(formatDateTime(ts, 'cs')).toBe(rucne(ts))
    }
    expect(formatDateTime('2026-08-19T12:00:00.000Z', 'cs')).toBe('19. 8. 2026')
  })

  it('jiný jazyk sází po svém', () => {
    expect(formatDateTime('2026-08-19T12:00:00.000Z', 'en')).toBe('8/19/2026')
    expect(formatDateTime('2026-08-19T12:00:00.000Z', 'de')).toBe('19.8.2026')
  })
})

describe('formatAuthors (A12)', () => {
  const autori = (...jmena: string[]) => jmena.map((name) => ({ name }))

  it('cs je identická s původním skládáním pro 1/2/3 autory', () => {
    expect(formatAuthors(autori('Anna'))).toBe('Anna')
    expect(formatAuthors(autori('Anna', 'Petr'))).toBe('Anna a Petr')
    expect(formatAuthors(autori('Anna', 'Petr', 'Eva'))).toBe('Anna, Petr a Eva')
    expect(formatAuthors(autori('Anna', 'Petr', 'Eva'), 'cs')).toBe('Anna, Petr a Eva')
  })

  it('prázdné a bezejmenné vstupy', () => {
    expect(formatAuthors([])).toBe('')
    expect(formatAuthors([{ name: null }, { name: 'Anna' }])).toBe('Anna')
  })

  it('jiný jazyk má vlastní spojku', () => {
    expect(formatAuthors(autori('Anna', 'Petr'), 'de')).toBe('Anna und Petr')
    expect(formatSeznam(['a', 'b', 'c'], 'en')).toBe('a, b, and c')
  })
})

describe('formatFigureNumber', () => {
  it('doplní dvě číslice, nečíselné nechá, prázdné = null', () => {
    const label = t('cs', 'figure.label')
    expect(formatFigureNumber('1', label)).toBe('Obr. 01')
    expect(formatFigureNumber('12', label)).toBe('Obr. 12')
    expect(formatFigureNumber('2a', label)).toBe('Obr. 2a')
    expect(formatFigureNumber(' ', label)).toBeNull()
    expect(formatFigureNumber(null, label)).toBeNull()
  })
})
