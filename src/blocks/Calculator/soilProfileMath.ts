/**
 * The root-zone calculator from kalkulator-pisku.html, without topdressing.
 * Volumes are additive, loose input volumes; this is not a soil compaction model.
 * Densities are kg/l, sand and soil prices per tonne, amendments per kg,
 * except biochar, which is priced per litre. Currency selects a price list only.
 */
export type ProfileMode = 'keep' | 'mix' | 'new'
export type SoilType = 'jil' | 'hlina' | 'pisek' | 'vlastni'
export type Currency = 'CZK' | 'EUR' | 'USD' | 'GBP'
export type Material = 'sand' | 'soil' | 'biovin' | 'zeolit' | 'char'
export type Amendment = 'biovin' | 'zeolit' | 'char'
export type MaterialValues = Record<Material, number>
export type Prices = MaterialValues
export type PriceLists = Record<Currency, Prices>

export interface SoilProfileInput {
  mode: ProfileMode
  soil: SoilType
  currency: Currency
  area: number
  depth: number
  /** Sand's percentage of the mineral base, after amendments take their space. */
  ratio: number
  biovin: number
  zeolit: number
  char: number
  /** Each amendment's incorporation depth, measured from the final surface. */
  biovinDepth: number
  zeolitDepth: number
  charDepth: number
  /** Fraction lost to settlement, expressed as a percentage; delivery /= 1-loss. */
  loss: number
  rhoS: number
  rhoZ: number
  rhoB: number
  rhoZe: number
  rhoC: number
  prices: Prices
}
export type ProfileInput = SoilProfileInput
export type NumericField = Exclude<keyof SoilProfileInput, 'mode' | 'soil' | 'currency' | 'prices'>

export const INPUT_LIMITS: Record<NumericField, { min: number; max: number; step: number }> = {
  area: { min: 0, max: 20000, step: 1 },
  depth: { min: 0, max: 100, step: 1 },
  ratio: { min: 0, max: 100, step: 5 },
  biovin: { min: 0, max: 20, step: 0.5 },
  zeolit: { min: 0, max: 20, step: 0.5 },
  char: { min: 0, max: 30, step: 0.5 },
  biovinDepth: { min: 1, max: 100, step: 1 },
  zeolitDepth: { min: 1, max: 100, step: 1 },
  charDepth: { min: 1, max: 100, step: 1 },
  loss: { min: 0, max: 35, step: 1 },
  rhoS: { min: 0.5, max: 2.5, step: 0.05 },
  rhoZ: { min: 0.5, max: 2.5, step: 0.05 },
  rhoB: { min: 0.1, max: 2, step: 0.05 },
  rhoZe: { min: 0.1, max: 2, step: 0.05 },
  rhoC: { min: 0.05, max: 1, step: 0.01 },
}

export const SOIL_PRESETS = {
  jil: { ratio: 65, zeolit: 2, char: 2, biovin: 2.5 },
  hlina: { ratio: 30, zeolit: 3, char: 3, biovin: 0 },
  pisek: { ratio: 0, zeolit: 8, char: 5, biovin: 5 },
} as const

export const MATERIALS: readonly Material[] = ['sand', 'soil', 'zeolit', 'char', 'biovin']
export const zeroPrices = (): Prices => ({ sand: 0, soil: 0, biovin: 0, zeolit: 0, char: 0 })
export const createPriceLists = (): PriceLists => ({
  CZK: zeroPrices(), EUR: zeroPrices(), USD: zeroPrices(), GBP: zeroPrices(),
})

export const INPUT_DEFAULTS: SoilProfileInput = {
  mode: 'keep', soil: 'jil', currency: 'CZK', area: 0, depth: 0,
  ...SOIL_PRESETS.jil,
  biovinDepth: 10, zeolitDepth: 15, charDepth: 10, loss: 0,
  rhoS: 1.5, rhoZ: 1.4, rhoB: 0.6, rhoZe: 0.8, rhoC: 0.2,
  prices: zeroPrices(),
}
export const DEFAULT_INPUT = INPUT_DEFAULTS

export interface ProfileIssue {
  field?: NumericField | `prices.${Material}` | 'mode'
  code: 'number' | 'range' | 'mix-ratio' | 'no-input' | 'rise' | 'zone-clipped'
  severity: 'error' | 'info' | 'warning'
  message: string
}

export interface MaterialDelivery {
  m3: number
  litres: number
  kg: number
  tonnes: number
  cost: number
}

export interface ProfileZone {
  from: number
  to: number
  volumeM3: number
  /** Litres per 100 l of measured ingredients; the five entries sum to 100. */
  litresPer100: MaterialValues
}

export interface ProfileCalculation {
  status: 'empty' | 'invalid' | 'ready'
  issues: ProfileIssue[]
  /** Net recipe, including soil already on site. */
  clean: MaterialValues
  /** Only materials to purchase, with the reserve already applied. */
  delivery: Record<Material, MaterialDelivery>
  initialVolume: number
  finalVolume: number
  finalDepth: number
  rise: number
  removeM3: number
  keepM3: number
  incorporationDepths: Record<Amendment, number>
  reserveFactor: number
  zones: ProfileZone[]
  totalCost: number
  hasPrices: boolean
  /** Required delivery materials with no positive price supplied. */
  missingPrices: Material[]
  sandTransport: { bigBags1t: number; bags25kg: number; trucks3t: number }
}

const FIELD_LABELS: Record<NumericField, string> = {
  area: 'Plocha', depth: 'Hloubka', ratio: 'Podíl písku', biovin: 'Actino',
  zeolit: 'Zeolit', char: 'Biochar', biovinDepth: 'Hloubka zapravení Actina',
  zeolitDepth: 'Hloubka zapravení zeolitu', charDepth: 'Hloubka zapravení biocharu',
  loss: 'Rezerva', rhoS: 'Hustota písku', rhoZ: 'Hustota zeminy',
  rhoB: 'Hustota Actina', rhoZe: 'Hustota zeolitu', rhoC: 'Hustota biocharu',
}

const PRICE_LABELS: Record<Material, string> = {
  sand: 'Cena písku', soil: 'Cena zeminy', biovin: 'Cena Actina',
  zeolit: 'Cena zeolitu', char: 'Cena biocharu',
}

function emptyResult(issues: ProfileIssue[], status: 'empty' | 'invalid'): ProfileCalculation {
  const delivery = Object.fromEntries(MATERIALS.map((key) => [key,
    { m3: 0, litres: 0, kg: 0, tonnes: 0, cost: 0 },
  ])) as Record<Material, MaterialDelivery>
  return {
    status, issues, clean: zeroPrices(), delivery,
    initialVolume: 0, finalVolume: 0, finalDepth: 0, rise: 0, removeM3: 0, keepM3: 0,
    incorporationDepths: { biovin: 0, zeolit: 0, char: 0 }, reserveFactor: 1, zones: [],
    totalCost: 0, hasPrices: false, missingPrices: [],
    sandTransport: { bigBags1t: 0, bags25kg: 0, trucks3t: 0 },
  }
}

/** Solve H = base + Σ fraction·min(H, incorporationDepth) exactly per interval. */
function mixedDepth(base: number, additions: { fraction: number; depth: number }[]): number {
  const active = additions.filter(({ fraction }) => fraction > 0)
  const boundaries = [...new Set(active.map(({ depth }) => depth))].sort((a, b) => a - b)
  for (const boundary of boundaries) {
    const capped = active.reduce((sum, addition) => addition.depth < boundary
      ? sum + addition.fraction * addition.depth : sum, 0)
    const growing = active.reduce((sum, addition) => addition.depth >= boundary
      ? sum + addition.fraction : sum, 0)
    const candidate = (base + capped) / (1 - growing)
    if (candidate <= boundary) return candidate
  }
  return base + active.reduce((sum, { fraction, depth }) => sum + fraction * depth, 0)
}

export function calculateSoilProfile(input: SoilProfileInput): ProfileCalculation {
  const issues: ProfileIssue[] = []
  for (const key of Object.keys(INPUT_LIMITS) as NumericField[]) {
    const value = input[key]
    const { min, max } = INPUT_LIMITS[key]
    if (!Number.isFinite(value)) {
      issues.push({ field: key, code: 'number', severity: 'error', message: `${FIELD_LABELS[key]}: zadejte platné číslo.` })
    } else if (value < min || value > max) {
      issues.push({ field: key, code: 'range', severity: 'error', message: `${FIELD_LABELS[key]}: hodnota musí být od ${min} do ${max}.` })
    }
  }
  for (const key of MATERIALS) {
    if (!Number.isFinite(input.prices[key]) || input.prices[key] < 0 || input.prices[key] > 1000000) {
      issues.push({ field: `prices.${key}`, code: 'range', severity: 'error', message: `${PRICE_LABELS[key]}: zadejte platné číslo od 0 do 1 000 000.` })
    }
  }
  if (input.mode === 'mix' && input.ratio >= 98) {
    issues.push({ field: 'ratio', code: 'mix-ratio', severity: 'error', message: 'Při podílu písku 98 % a více použijte režim Nová vrstva.' })
  }
  if (issues.length) return emptyResult(issues, 'invalid')
  if (input.area === 0 || input.depth === 0) {
    return emptyResult([{ code: 'no-input', severity: 'info', message: 'Zadejte plochu a hloubku.' }], 'empty')
  }

  const p = input.ratio / 100
  const b = input.biovin / 100
  const z = input.zeolit / 100
  const c = input.char / 100
  const initialVolume = input.area * input.depth / 100
  const additions = [
    { fraction: b, depth: input.biovinDepth },
    { fraction: z, depth: input.zeolitDepth },
    { fraction: c, depth: input.charDepth },
  ]
  const finalDepth = input.mode === 'mix'
    ? mixedDepth(input.depth / (1 - p), additions)
    : input.depth
  const finalVolume = input.area * finalDepth / 100
  const incorporationDepths = {
    biovin: Math.min(input.biovinDepth, finalDepth),
    zeolit: Math.min(input.zeolitDepth, finalDepth),
    char: Math.min(input.charDepth, finalDepth),
  }
  const clean = zeroPrices()
  clean.biovin = b * input.area * incorporationDepths.biovin / 100
  clean.char = c * input.area * incorporationDepths.char / 100
  clean.zeolit = z * input.area * incorporationDepths.zeolit / 100
  const amendments = clean.biovin + clean.char + clean.zeolit
  const mineralBase = input.mode === 'mix' ? initialVolume / (1 - p) : finalVolume - amendments
  clean.sand = p * mineralBase
  clean.soil = input.mode === 'mix' ? initialVolume : (1 - p) * mineralBase
  const keepM3 = input.mode === 'new' ? 0 : clean.soil
  const removeM3 = input.mode === 'keep' ? initialVolume - keepM3 : 0
  const reserveFactor = 1 / (1 - input.loss / 100)
  const densities: MaterialValues = {
    sand: input.rhoS, soil: input.rhoZ, biovin: input.rhoB, zeolit: input.rhoZe, char: input.rhoC,
  }
  const delivery = Object.fromEntries(MATERIALS.map((key) => {
    const m3 = key === 'soil' && input.mode !== 'new' ? 0 : clean[key] * reserveFactor
    const litres = m3 * 1000
    const kg = litres * densities[key]
    const tonnes = kg / 1000
    const pricedQuantity = key === 'sand' || key === 'soil' ? tonnes : key === 'char' ? litres : kg
    return [key, { m3, litres, kg, tonnes, cost: pricedQuantity * input.prices[key] }]
  })) as Record<Material, MaterialDelivery>

  const zones: ProfileZone[] = []
  const addZone = (from: number, to: number, charPct: number, biovinPct: number, zeolitPct: number) => {
    if (to <= from) return
    const basePct = 100 - charPct - biovinPct - zeolitPct
    zones.push({
      from, to, volumeM3: input.area * (to - from) / 100,
      litresPer100: {
        sand: p * basePct, soil: (1 - p) * basePct,
        char: charPct, biovin: biovinPct, zeolit: zeolitPct,
      },
    })
  }
  const boundaries = [...new Set([
    0, finalDepth,
    ...additions.filter(({ fraction }) => fraction > 0).map(({ depth }) => Math.min(depth, finalDepth)),
  ])].sort((a, b) => a - b)
  for (let i = 1; i < boundaries.length; i++) {
    const from = boundaries[i - 1]
    addZone(from, boundaries[i],
      from < incorporationDepths.char ? input.char : 0,
      from < incorporationDepths.biovin ? input.biovin : 0,
      from < incorporationDepths.zeolit ? input.zeolit : 0,
    )
  }
  const rise = finalDepth - input.depth
  if (input.mode === 'mix' && rise >= 8) {
    issues.push({ code: 'rise', severity: 'warning', message: 'Terén se výrazně zvedne. Zkontrolujte obrubníky, prahy, terasu a odtok vody, případně zvolte Udržet výšku.' })
  }
  if (additions.some(({ fraction, depth }) => fraction > 0 && finalDepth < depth)) {
    issues.push({ code: 'zone-clipped', severity: 'info', message: 'Profil je mělčí než některé zadané hloubky zapravení. Příměsi se počítají jen do skutečné hloubky profilu.' })
  }
  const totalCost = MATERIALS.reduce((sum, key) => sum + delivery[key].cost, 0)
  const sandTonnes = delivery.sand.tonnes
  return {
    status: 'ready', issues, clean, delivery, initialVolume, finalVolume, finalDepth, rise,
    removeM3, keepM3, incorporationDepths, reserveFactor, zones, totalCost,
    hasPrices: totalCost > 0,
    missingPrices: MATERIALS.filter((key) => delivery[key].m3 > 0 && input.prices[key] === 0),
    sandTransport: {
      bigBags1t: Math.ceil(sandTonnes), bags25kg: Math.ceil(sandTonnes * 40), trucks3t: Math.ceil(sandTonnes / 3),
    },
  }
}

export const calculateProfile = calculateSoilProfile
