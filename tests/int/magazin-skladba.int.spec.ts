import { describe, expect, it } from 'vitest'

import { oknoStran, sestavSkupiny, vyberKalkulatory, type LehkyClanek, type Tema } from '../../src/components/Magazin/skladba'

const PUDA: Tema = { id: 1, slug: 'puda', titulek: 'Půda', popis: null, serie: true }
const ZAVLAHA: Tema = { id: 2, slug: 'zavlaha', titulek: 'Závlaha', popis: null, serie: false }
const c = (id: number, kategorie: number[], den: number): LehkyClanek => ({ id, kategorie, publishedAt: `2026-09-${String(den).padStart(2, '0')}T08:00:00.000Z` })

describe('skladba magazínu (DESIGN.md 8.5)', () => {
  it('série jde od nejstaršího s díly k z N, téma od nejnovějšího; téma článku je jeho první kategorie', () => {
    const lehke = [c(5, [1], 12), c(9, [1], 30), c(7, [1, 2], 20), c(4, [2], 1), c(8, [2], 25), c(2, [], 3)]
    const { skupiny, dily, temaClanku } = sestavSkupiny(lehke, [PUDA, ZAVLAHA])
    expect(skupiny.map((s) => [s.tema.slug, s.clanky])).toEqual([['puda', [5, 7, 9]], ['zavlaha', [8, 4]]])
    expect(dily.get(5)).toEqual({ k: 1, z: 3 })
    expect(dily.get(9)).toEqual({ k: 3, z: 3 })
    expect(dily.has(8)).toBe(false)
    expect(temaClanku.get(7)?.slug).toBe('puda')
    expect(temaClanku.has(2)).toBe(false)
  })

  it('téma s jediným článkem vlastní pás nemá, nejvýš 3 témata', () => {
    const temata = [1, 2, 3, 4].map((id) => ({ id, slug: `t${id}`, titulek: `T${id}`, popis: null, serie: false }))
    const lehke = [c(1, [1], 1), c(2, [1], 2), c(3, [2], 3), c(4, [3], 4), c(5, [3], 5), c(6, [4], 6), c(7, [4], 7), c(8, [2], 8)]
    const { skupiny } = sestavSkupiny(lehke, temata)
    expect(skupiny.map((s) => s.tema.slug)).toEqual(['t1', 't2', 't3'])
    expect(sestavSkupiny([c(1, [1], 1)], [PUDA]).skupiny).toEqual([])
  })

  it('okno stránkování', () => {
    expect(oknoStran(1, 3)).toEqual([1, 2, 3])
    expect(oknoStran(5, 9)).toEqual([1, null, 4, 5, 6, null, 9])
    expect(oknoStran(1, 9)).toEqual([1, 2, null, 9])
  })

  it('kalkulátory v pořadí stránky, každý druh jednou', () => {
    const radky = [
      { kalkulatory: ['vsak'], href: '/magazin/a', titulek: 'A' },
      { kalkulatory: ['vsak', 'prutok'], href: '/magazin/b', titulek: 'B' },
    ]
    expect(vyberKalkulatory(radky)).toEqual([
      { druh: 'vsak', href: '/magazin/a#kalkulator-vsak', clanek: 'A' },
      { druh: 'prutok', href: '/magazin/b#kalkulator-prutok', clanek: 'B' },
    ])
  })
})
