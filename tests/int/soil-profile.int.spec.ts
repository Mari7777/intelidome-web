import { describe, expect, it } from 'vitest'
import {
  calculateSoilProfile, createPriceLists, INPUT_DEFAULTS, MATERIALS, SOIL_PRESETS,
  type ProfileMode, type SoilProfileInput,
} from '@/blocks/Calculator/soilProfileMath'

const input = (overrides: Partial<SoilProfileInput> = {}): SoilProfileInput => ({
  ...INPUT_DEFAULTS, area: 100, depth: 30, prices: { ...INPUT_DEFAULTS.prices }, ...overrides,
})

describe('soil profile calculator', () => {
  it('reproduces the 100 m² clay recipe and replaces only the necessary soil', () => {
    const result = calculateSoilProfile(input())
    expect(result.status).toBe('ready')
    expect(result.clean.sand).toBeCloseTo(19.0125, 10)
    expect(result.clean.soil).toBeCloseTo(10.2375, 10)
    expect(result.clean.zeolit).toBeCloseTo(0.3, 10)
    expect(result.clean.char).toBeCloseTo(0.2, 10)
    expect(result.clean.biovin).toBeCloseTo(0.25, 10)
    expect(result.removeM3).toBeCloseTo(19.7625, 10)
    expect(result.keepM3).toBeCloseTo(10.2375, 10)
    expect(result.delivery.soil.m3).toBe(0)
    expect(result.finalVolume).toBe(30)
    expect(result.finalDepth).toBe(30)
    expect(result.rise).toBe(0)
    expect(result.delivery.sand.tonnes).toBeCloseTo(28.51875, 10)
    expect(result.delivery.zeolit.kg).toBeCloseTo(240, 10)
    expect(result.delivery.biovin.kg).toBeCloseTo(150, 10)
    expect(result.delivery.char.kg).toBeCloseTo(40, 10)
    expect(result.sandTransport).toEqual({ bigBags1t: 29, bags25kg: 1141, trucks3t: 10 })
  })

  it('imports every component for a new layer, with no existing soil or removal', () => {
    const result = calculateSoilProfile(input({ mode: 'new' }))
    expect(result.delivery.soil.m3).toBeCloseTo(10.2375, 10)
    expect(result.delivery.soil.tonnes).toBeCloseTo(14.3325, 10)
    expect(result.keepM3).toBe(0)
    expect(result.removeM3).toBe(0)
    expect(result.finalVolume).toBe(30)
  })

  it('keeps the original soil in mix mode and calculates the increased height', () => {
    const result = calculateSoilProfile(input({ mode: 'mix', ratio: 50, biovin: 0, zeolit: 0, char: 0 }))
    expect(result.clean.sand).toBe(30)
    expect(result.clean.soil).toBe(30)
    expect(result.keepM3).toBe(30)
    expect(result.removeM3).toBe(0)
    expect(result.delivery.soil.m3).toBe(0)
    expect(result.finalVolume).toBe(60)
    expect(result.finalDepth).toBe(60)
    expect(result.rise).toBe(30)
    expect(result.issues.some(({ code }) => code === 'rise')).toBe(true)
  })

  it('solves a shallow profile with high amendment fractions without iteration drift', () => {
    const result = calculateSoilProfile(input({
      mode: 'mix', area: 1, depth: 1, ratio: 0, char: 30, biovin: 20, zeolit: 20,
    }))
    expect(result.finalDepth).toBeCloseTo(10 / 3, 12)
    expect(result.clean.soil).toBeCloseTo(0.01, 12)
    expect(result.finalVolume).toBeCloseTo(1 / 30, 12)
    expect(result.zones).toHaveLength(1)
    expect(result.zones[0].litresPer100).toEqual({ sand: 0, soil: 30, char: 30, biovin: 20, zeolit: 20 })
  })

  it('solves the middle and lower depth intervals when mixed amendments cross a boundary', () => {
    const middle = calculateSoilProfile(input({
      mode: 'mix', depth: 8, ratio: 0, char: 30, biovin: 0, zeolit: 20,
    }))
    expect(middle.finalDepth).toBeCloseTo(13.75, 12)
    expect(middle.zones).toHaveLength(2)
    const lower = calculateSoilProfile(input({ mode: 'mix' }))
    expect(lower.finalDepth).toBeCloseTo(30 / 0.35 + 0.75, 12)
    expect(lower.zones).toHaveLength(3)
  })

  it.each(['keep', 'mix', 'new'] as ProfileMode[])('applies settlement reserve only to deliveries in %s mode', (mode) => {
    const clean = calculateSoilProfile(input({ mode }))
    const withReserve = calculateSoilProfile(input({ mode, loss: 10 }))
    expect(withReserve.reserveFactor).toBeCloseTo(1 / 0.9, 12)
    expect(withReserve.finalVolume).toBe(clean.finalVolume)
    expect(withReserve.finalDepth).toBe(clean.finalDepth)
    expect(withReserve.removeM3).toBe(clean.removeM3)
    expect(withReserve.keepM3).toBe(clean.keepM3)
    expect(withReserve.clean).toEqual(clean.clean)
    expect(withReserve.zones).toEqual(clean.zones)
    for (const material of MATERIALS) {
      expect(withReserve.delivery[material].m3).toBeCloseTo(clean.delivery[material].m3 / 0.9, 10)
    }
  })

  it('clips zones to the actual layer and retains every non-zero zone', () => {
    const shallow = calculateSoilProfile(input({ depth: 5 }))
    expect(shallow.incorporationDepths).toEqual({ biovin: 5, zeolit: 5, char: 5 })
    expect(shallow.zones).toHaveLength(1)
    expect(shallow.clean.biovin).toBeCloseTo(0.125, 10)
    expect(shallow.clean.char).toBeCloseTo(0.1, 10)
    expect(shallow.clean.zeolit).toBeCloseTo(0.1, 10)
    const thin = calculateSoilProfile(input({ depth: 15.2 }))
    expect(thin.zones).toHaveLength(3)
    expect(thin.zones[2].from).toBe(15)
    expect(thin.zones[2].to).toBe(15.2)
  })

  it.each(['keep', 'mix', 'new'] as ProfileMode[])('conserves volume and zone composition across valid recipes in %s mode', (mode) => {
    for (const depth of [1, 9.5, 10, 12, 15, 15.2, 30, 100]) {
      for (const preset of Object.values(SOIL_PRESETS)) {
        const result = calculateSoilProfile(input({ ...preset, mode, depth }))
        expect(result.status).toBe('ready')
        expect(Object.values(result.clean).reduce((sum, value) => sum + value, 0)).toBeCloseTo(result.finalVolume, 10)
        expect(result.zones.reduce((sum, zone) => sum + zone.volumeM3, 0)).toBeCloseTo(result.finalVolume, 10)
        for (const zone of result.zones) {
          expect(Object.values(zone.litresPer100).reduce((sum, value) => sum + value, 0)).toBeCloseTo(100, 10)
        }
        for (const material of MATERIALS) {
          const zoneVolume = result.zones.reduce((sum, zone) => sum + zone.volumeM3 * zone.litresPer100[material] / 100, 0)
          expect(zoneVolume).toBeCloseTo(result.clean[material], 10)
        }
      }
    }
  })

  it('uses the sandy soil preset without importing sand', () => {
    const result = calculateSoilProfile(input({ ...SOIL_PRESETS.pisek, soil: 'pisek' }))
    expect(result.clean.sand).toBe(0)
    expect(result.removeM3).toBeCloseTo(2.2, 10)
    expect(result.clean.zeolit).toBeCloseTo(1.2, 10)
    expect(result.clean.char).toBeCloseTo(0.5, 10)
    expect(result.clean.biovin).toBeCloseTo(0.5, 10)
    expect(result.sandTransport).toEqual({ bigBags1t: 0, bags25kg: 0, trucks3t: 0 })
  })

  it('uses tonnes, kilograms and litres for the correct price units', () => {
    const prices = { sand: 1000, soil: 500, biovin: 10, zeolit: 20, char: 2 }
    const result = calculateSoilProfile(input({ mode: 'new', prices }))
    expect(result.delivery.sand.cost).toBeCloseTo(28518.75, 8)
    expect(result.delivery.soil.cost).toBeCloseTo(7166.25, 8)
    expect(result.delivery.biovin.cost).toBeCloseTo(1500, 8)
    expect(result.delivery.zeolit.cost).toBeCloseTo(4800, 8)
    expect(result.delivery.char.cost).toBeCloseTo(400, 8)
    expect(result.totalCost).toBeCloseTo(42385, 8)
    expect(result.missingPrices).toEqual([])
    expect(result.hasPrices).toBe(true)
    const denserChar = calculateSoilProfile(input({ mode: 'new', prices, rhoC: 0.48 }))
    expect(denserChar.delivery.char.kg).toBeCloseTo(96, 10)
    expect(denserChar.delivery.char.cost).toBe(result.delivery.char.cost)
    const keptSoil = calculateSoilProfile(input({ prices }))
    expect(keptSoil.delivery.soil.cost).toBe(0)
    expect(keptSoil.totalCost).toBeCloseTo(35218.75, 8)
  })

  it('keeps price lists independent and never converts a price when currency changes', () => {
    const lists = createPriceLists()
    lists.CZK.sand = 1000
    lists.EUR.sand = 40
    expect(lists.GBP.sand).toBe(0)
    expect(lists.USD.sand).toBe(0)
    expect(lists.CZK.sand).toBe(1000)
    const czk = calculateSoilProfile(input({ currency: 'CZK', prices: lists.CZK }))
    const eur = calculateSoilProfile(input({ currency: 'EUR', prices: lists.EUR }))
    expect(czk.totalCost).toBeCloseTo(28518.75, 8)
    expect(eur.totalCost).toBeCloseTo(1140.75, 8)
    expect(eur.missingPrices).toEqual(['zeolit', 'char', 'biovin'])
    const relabelled = calculateSoilProfile(input({ currency: 'EUR', prices: lists.CZK }))
    expect(relabelled.totalCost).toBe(czk.totalCost)
  })

  it('supports no-amendment and pure-sand new layers without phantom deliveries', () => {
    const unchanged = calculateSoilProfile(input({ ratio: 0, zeolit: 0, char: 0, biovin: 0 }))
    expect(unchanged.removeM3).toBe(0)
    expect(unchanged.keepM3).toBe(30)
    expect(MATERIALS.every((key) => unchanged.delivery[key].m3 === 0)).toBe(true)
    const sand = calculateSoilProfile(input({ mode: 'new', ratio: 100, zeolit: 0, char: 0, biovin: 0 }))
    expect(sand.status).toBe('ready')
    expect(sand.delivery.sand.m3).toBe(30)
    expect(sand.delivery.soil.m3).toBe(0)
  })

  it('returns no usable result for empty or invalid quantities instead of silently changing them', () => {
    expect(calculateSoilProfile({ ...INPUT_DEFAULTS }).status).toBe('empty')
    for (const overrides of [
      { area: NaN }, { area: -5 }, { depth: 101 }, { loss: Infinity },
      { loss: 36 }, { rhoC: 0 }, { biovinDepth: 0 }, { charDepth: NaN }, { zeolitDepth: 101 },
      { mode: 'mix' as const, ratio: 98 }, { mode: 'mix' as const, ratio: 100 },
      { prices: { ...INPUT_DEFAULTS.prices, sand: -1 } },
    ]) {
      const result = calculateSoilProfile(input(overrides))
      expect(result.status).toBe('invalid')
      expect(result.totalCost).toBe(0)
      expect(result.zones).toEqual([])
      expect(result.issues.some(({ severity }) => severity === 'error')).toBe(true)
    }
  })

  it('identifies each invalid price field so the corresponding input can show its error', () => {
    const result = calculateSoilProfile(input({
      prices: { sand: -1, soil: 0, zeolit: NaN, char: 0, biovin: 0 },
    }))
    expect(result.status).toBe('invalid')
    expect(result.issues.map(({ field }) => field)).toEqual(['prices.sand', 'prices.zeolit'])
  })

  it('uses each amendment\'s own depth even when Actino goes deeper than zeolite', () => {
    const result = calculateSoilProfile(input({ biovinDepth: 20, charDepth: 5, zeolitDepth: 12 }))
    expect(result.status).toBe('ready')
    expect(result.incorporationDepths).toEqual({ biovin: 20, char: 5, zeolit: 12 })
    expect(result.clean.biovin).toBeCloseTo(0.5, 10)
    expect(result.clean.char).toBeCloseTo(0.1, 10)
    expect(result.clean.zeolit).toBeCloseTo(0.24, 10)
    expect(result.clean.sand).toBeCloseTo(18.954, 10)
    expect(result.clean.soil).toBeCloseTo(10.206, 10)
    expect(result.zones.map(({ from, to }) => [from, to])).toEqual([[0, 5], [5, 12], [12, 20], [20, 30]])
    expect(result.zones.map(({ litresPer100: { char, biovin, zeolit } }) => [char, biovin, zeolit]))
      .toEqual([[2, 2.5, 2], [0, 2.5, 2], [0, 2.5, 0], [0, 0, 0]])
  })

  it('solves arbitrary incorporation order exactly when mixing crosses two boundaries', () => {
    const result = calculateSoilProfile(input({
      mode: 'mix', depth: 8, ratio: 0,
      biovin: 20, biovinDepth: 20, char: 30, charDepth: 5, zeolit: 20, zeolitDepth: 12,
    }))
    expect(result.status).toBe('ready')
    expect(result.finalDepth).toBeCloseTo(14.875, 12)
    expect(result.clean.soil).toBe(8)
    expect(result.clean.biovin).toBeCloseTo(2.975, 12)
    expect(result.clean.char).toBeCloseTo(1.5, 12)
    expect(result.clean.zeolit).toBeCloseTo(2.4, 12)
    expect(result.zones.map(({ from, to }) => [from, to])).toEqual([[0, 5], [5, 12], [12, 14.875]])
    expect(result.incorporationDepths).toEqual({ biovin: 14.875, char: 5, zeolit: 12 })
    expect(result.issues.some(({ code }) => code === 'zone-clipped')).toBe(true)
  })

  it('retains thin intervals and clips each depth independently', () => {
    const result = calculateSoilProfile(input({ depth: 12, charDepth: 10, biovinDepth: 10.2, zeolitDepth: 20 }))
    expect(result.incorporationDepths).toEqual({ biovin: 10.2, char: 10, zeolit: 12 })
    expect(result.zones.map(({ from, to }) => [from, to])).toEqual([[0, 10], [10, 10.2], [10.2, 12]])
    expect(result.clean.biovin).toBeCloseTo(0.255, 12)
    expect(result.clean.char).toBeCloseTo(0.2, 12)
    expect(result.clean.zeolit).toBeCloseTo(0.24, 12)
  })

  it('does not create boundaries or clipping notices for omitted amendments', () => {
    const result = calculateSoilProfile(input({
      biovin: 0, biovinDepth: 3, char: 0, charDepth: 40, zeolit: 2, zeolitDepth: 15,
    }))
    expect(result.zones.map(({ from, to }) => [from, to])).toEqual([[0, 15], [15, 30]])
    expect(result.issues.some(({ code }) => code === 'zone-clipped')).toBe(false)
    const plain = calculateSoilProfile(input({ biovin: 0, char: 0, zeolit: 0 }))
    expect(plain.zones.map(({ from, to }) => [from, to])).toEqual([[0, 30]])
    const sameDepth = calculateSoilProfile(input({ biovinDepth: 10, charDepth: 10, zeolitDepth: 10 }))
    expect(sameDepth.zones.map(({ from, to }) => [from, to])).toEqual([[0, 10], [10, 30]])
  })

  it.each(['keep', 'mix', 'new'] as ProfileMode[])('preserves recipe and delivery balances for all incorporation orders in %s mode', (mode) => {
    const depths = [
      [3, 8, 14], [3, 14, 8], [8, 3, 14],
      [8, 14, 3], [14, 3, 8], [14, 8, 3],
    ]
    for (const [biovinDepth, zeolitDepth, charDepth] of depths) {
      for (const depth of [1, 5, 10, 30]) {
        const result = calculateSoilProfile(input({ mode, depth, biovinDepth, zeolitDepth, charDepth, loss: 15 }))
        expect(result.status).toBe('ready')
        expect(Object.values(result.clean).reduce((sum, value) => sum + value, 0)).toBeCloseTo(result.finalVolume, 10)
        expect(result.zones.reduce((sum, zone) => sum + zone.volumeM3, 0)).toBeCloseTo(result.finalVolume, 10)
        const importedNet = MATERIALS.reduce((sum, material) => sum + result.delivery[material].m3 / result.reserveFactor, 0)
        expect(importedNet + result.keepM3).toBeCloseTo(result.finalVolume, 10)
        if (mode === 'keep') expect(result.keepM3 + result.removeM3).toBeCloseTo(result.initialVolume, 10)
        for (const zone of result.zones) {
          expect(Object.values(zone.litresPer100).reduce((sum, value) => sum + value, 0)).toBeCloseTo(100, 10)
        }
        for (const material of MATERIALS) {
          const zoneVolume = result.zones.reduce((sum, zone) => sum + zone.volumeM3 * zone.litresPer100[material] / 100, 0)
          expect(zoneVolume).toBeCloseTo(result.clean[material], 10)
        }
      }
    }
  })
})
