'use client'

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

import {
  calculateSoilProfile,
  INPUT_DEFAULTS,
  SOIL_PRESETS,
  type Amendment,
  type SoilProfileInput,
} from './soilProfileMath'
import './SoilProfileCalculator.css'

const Ok = () => (
  <span className="ic">
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  </span>
)

type Mode = SoilProfileInput['mode']
type Soil = SoilProfileInput['soil']
type Currency = SoilProfileInput['currency']
type Material = keyof SoilProfileInput['prices']
type Result = ReturnType<typeof calculateSoilProfile>

const NUMBER_KEYS = [
  'area', 'depth', 'ratio', 'biovin', 'zeolit', 'char', 'biovinDepth', 'zeolitDepth', 'charDepth',
  'loss', 'rhoS', 'rhoZ', 'rhoB', 'rhoZe', 'rhoC',
] as const
type NumberKey = typeof NUMBER_KEYS[number]
type RawNumbers = Record<NumberKey, string>
type RawPrices = Record<Currency, Record<Material, string>>

const MATERIALS: Material[] = ['sand', 'soil', 'char', 'biovin', 'zeolit']
const MATERIAL_NAMES: Record<Material, string> = {
  sand: 'Písek', soil: 'Zemina', char: 'Biochar', biovin: 'Actino', zeolit: 'Zeolit',
}
const MATERIAL_COLORS: Record<Material, string> = {
  sand: '#c2a052', soil: '#6b5138', char: '#12161b', biovin: '#54402c', zeolit: '#d5d3cc',
}
const SYMBOLS: Record<Currency, string> = { CZK: 'Kč', EUR: '€', USD: '$', GBP: '£' }
const CURRENCIES: Currency[] = ['CZK', 'EUR', 'USD', 'GBP']
const PRICE_UNITS: Record<Material, string> = {
  sand: 't', soil: 't', char: 'l', biovin: 'kg', zeolit: 'kg',
}
const MODE_HINTS: Record<Mode, string> = {
  keep: 'Část zeminy předem odvezete. Písek a příměsi pak nahradí její objem, aby zadaná výška terénu zůstala.',
  mix: 'Písek a příměsi zapravíte do stávající zeminy, kterou neodvážíte. Modelová výška profilu proto bude vyšší; zóny se počítají od jeho nového povrchu.',
  new: 'Písek, zeminu i příměsi dovezete. Novou vrstvu uložíte po zónách na připravené podloží.',
}
const SOIL_HINTS: Record<Soil, string> = {
  jil: 'Jílovitá zahrada přestavovaná pískem: zeolit 2–5 %, biochar 2–5 %, Actino 2,5–5 % objemu své zóny.',
  hlina: 'Těžší hlinitá zahrada s udržovanou ornicí: zeolit 3–7 %, biochar 3–7 %, Actino 0 %.',
  pisek: 'Chudá, rychle vysychající písčitá zahrada: zeolit 8–10 %, biochar 5–10 %, Actino 5–10 %. Další písek se nepřidává.',
  vlastni: 'Vlastní receptura: podíly zvolte podle půdy a materiálů, které použijete. Procenta příměsí vždy patří k objemu jejich zóny.',
}

const format = (value: number, maximumFractionDigits = 2): string =>
  Number.isFinite(value)
    ? value.toLocaleString('cs-CZ', { maximumFractionDigits })
    : '—'
const volume = (m3: number): string =>
  m3 < 1 ? format(m3 * 1000, 1) + ' l' : format(m3) + ' m³'
const mass = (kg: number): string =>
  kg < 1000 ? format(kg, 1) + ' kg' : format(kg / 1000) + ' t'
const money = (value: number, currency: Currency): string =>
  format(value, currency === 'CZK' ? 0 : 2) + ' ' + SYMBOLS[currency]
const typography = nezlomitelneMezery

/** Preserve unfinished decimal input, including the Czech decimal comma. */
const parseNumber = (raw: string): number => {
  const normalized = raw.trim().replace(/[\s\u00a0]/g, '').replace(',', '.')
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return NaN
  return Number(normalized)
}
const initialRaw = (): RawNumbers => Object.fromEntries(
  NUMBER_KEYS.map((key) => [
    key,
    key === 'area' ? '100' : key === 'depth' ? '30' : String(INPUT_DEFAULTS[key]).replace('.', ','),
  ]),
) as RawNumbers
const initialPrices = (): RawPrices => Object.fromEntries(
  CURRENCIES.map((currency) => [
    currency, Object.fromEntries(MATERIALS.map((material) => [material, '0'])),
  ]),
) as RawPrices

type FieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  unit: string
  hint?: string
  error?: string
  prominent?: boolean
  context?: string
}

function NumberField({ id, label, value, onChange, unit, hint, error, prominent, context }: FieldProps) {
  const describedBy = [
    id + '-unit', hint && id + '-hint', error && id + '-error',
  ].filter(Boolean).join(' ')
  return (
    <div className={'id-profile-calc__field' + (prominent ? ' id-profile-calc__field--large' : '')}>
      <label htmlFor={id}>{typography(label)}</label>
      <div className="id-profile-calc__inputrow">
        <input
          aria-label={context ? label + ' — ' + context : undefined}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          id={id}
          inputMode="decimal"
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          type="text"
          value={value}
        />
        <span id={id + '-unit'}>{unit}</span>
      </div>
      {hint && <p className="id-profile-calc__hint" id={id + '-hint'}>{typography(hint)}</p>}
      {error && <p className="id-profile-calc__error" id={id + '-error'}>{typography(error)}</p>}
    </div>
  )
}

/** Align the first amendment with the profile fields while preserving mobile reading order. */
function AlignedInputColumns({ children }: { children: React.ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const desktop = window.matchMedia('(min-width: 1130px)')
    let offset = 0
    let frame = 0
    const align = () => {
      const profileLine = grid.querySelector<HTMLInputElement>('input[id$="-depth"]')?.parentElement
      const amendmentLine = grid.querySelector<HTMLInputElement>('input[id$="-biovin"]')?.parentElement
      if (!profileLine || !amendmentLine) return
      const next = desktop.matches
        ? Math.max(0, offset + profileLine.getBoundingClientRect().bottom - amendmentLine.getBoundingClientRect().bottom)
        : 0
      if (Math.abs(next - offset) < 0.25) return
      offset = next
      grid.style.setProperty('--id-profile-addition-offset', offset + 'px')
    }
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(align)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(grid)
    grid.querySelectorAll('.id-profile-calc__basics > *, .id-profile-calc__additions > *, .id-profile-calc__amendment').forEach((element) => observer.observe(element))
    desktop.addEventListener('change', schedule)
    align()
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', schedule)
      window.cancelAnimationFrame(frame)
      grid.style.removeProperty('--id-profile-addition-offset')
    }
  }, [])

  return <div className="id-profile-calc__inputgrid" ref={gridRef}>{children}</div>
}

function Choices<T extends string>({
  legend, name, value, options, onChange,
}: {
  legend: string
  name: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="id-profile-calc__choices">
      <legend>{legend}</legend>
      <div className="id-profile-calc__segments">
        {options.map((option) => (
          <label key={option.value}>
            <input
              checked={value === option.value}
              name={name}
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function MaterialTable({
  calculation, currency, showPrices, ready,
}: {
  calculation: Result
  currency: Currency
  showPrices: boolean
  ready: boolean
}) {
  return (
    <table className="id-profile-calc__table" role="table">
      <caption>Materiály k objednání</caption>
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">Materiál</th>
          <th role="columnheader" scope="col">Objem</th>
          <th role="columnheader" scope="col">Hmotnost ≈</th>
          {showPrices && <th role="columnheader" scope="col">Cena</th>}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {MATERIALS.map((material) => {
          const quantity = calculation.delivery[material]
          return (
            <tr key={material} role="row">
              <th role="rowheader" scope="row">{MATERIAL_NAMES[material]}</th>
              <td role="cell">
                <span className="id-profile-calc__mobilelabel">Objem</span>
                <span>{ready ? typography(volume(quantity.m3)) : '—'}</span>
              </td>
              <td role="cell">
                <span className="id-profile-calc__mobilelabel">Hmotnost ≈</span>
                <span>{ready ? typography(mass(quantity.kg)) : '—'}</span>
              </td>
              {showPrices && <td role="cell">
                <span className="id-profile-calc__mobilelabel">Cena</span>
                <span>{ready && quantity.cost > 0 ? typography(money(quantity.cost, currency)) : '—'}</span>
              </td>}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/** Display quantities without implying separate strata for individual ingredients. */
function ProfileDrawing({ calculation, input, uid }: {
  calculation: Result
  input: SoilProfileInput
  uid: string
}) {
  if (calculation.status !== 'ready') {
    return (
      <section className="id-profile-calc__drawing id-profile-calc__drawing--empty">
        <h3>Jak se profil změní</h3>
        <p>Doplňte platné zadání. Řez pak porovná původní a připravený profil včetně hloubek zapravení.</p>
      </section>
    )
  }
  const finalDepth = calculation.finalDepth
  const scale = 180 / Math.max(input.depth, finalDepth, 1)
  const bottom = 234
  const top = bottom - finalDepth * scale
  const beforeTop = bottom - input.depth * scale
  const newLayer = input.mode === 'new'
  const chartLabel = newLayer
    ? 'Nová vrstva do hloubky ' + format(finalDepth) + ' centimetrů.'
    : 'Zadaná hloubka ' + format(input.depth) + ' centimetrů, modelová hloubka '
      + format(finalDepth) + ' centimetrů. '
      + (input.mode === 'mix' ? 'Objemově odpovídá zvýšení o ' + format(calculation.rise) + ' centimetrů.' : 'Model zachovává zadanou výšku.')
  const zonesDescription = 'Složení připravené směsi podle hloubky od povrchu. ' + calculation.zones.map((zone) =>
    'Od ' + format(zone.from) + ' do ' + format(zone.to) + ' centimetrů: '
      + MATERIALS.filter((material) => zone.litresPer100[material] > 0).map((material) =>
        MATERIAL_NAMES[material] + ' ' + format(zone.litresPer100[material]) + ' % objemu',
      ).join(', ') + '.',
  ).join(' ')
  return (
    <figure className="id-profile-calc__drawing">
      <h3>Jak se profil změní</h3>
      <p className="id-profile-calc__drawing-lead">{typography(chartLabel)}</p>
      <div className="id-profile-calc__profiles">
        <div className="id-profile-calc__profile">
          <h4>{newLayer ? 'Připravený prostor' : 'Stávající půda'}</h4>
          <svg
            aria-label={newLayer ? 'Prostor pro novou vrstvu.' : 'Původní půda, hloubka ' + format(input.depth) + ' centimetrů.'}
            role="img"
            viewBox="0 0 320 292"
          >
            <defs>
              <pattern height="9" id={uid + '-removed'} patternUnits="userSpaceOnUse" width="9">
                <path d="M0 9 9 0" fill="none" stroke="var(--id-cream, #f6f5f2)" strokeWidth="1.6" />
              </pattern>
            </defs>
            <rect fill="#54402c" height="24" width="220" x="40" y={bottom} />
            <rect
              fill={newLayer ? 'none' : '#6b5138'}
              height={input.depth * scale}
              stroke="#232830"
              strokeDasharray={newLayer ? '4 5' : undefined}
              strokeWidth="1.6"
              width="220"
              x="40"
              y={beforeTop}
            />
            {!newLayer && input.mode === 'keep' && calculation.removeM3 > 0 && (
              <rect
                fill={'url(#' + uid + '-removed)'}
                height={input.depth * scale * calculation.removeM3 / calculation.initialVolume}
                opacity="0.7"
                width="220"
                x="40"
                y={beforeTop}
              />
            )}
            <line stroke="#3f7d4e" strokeWidth="3" x1="40" x2="260" y1={beforeTop} y2={beforeTop} />
            <text className="id-profile-calc__svg-label" textAnchor="end" x="310" y={beforeTop + 5}>0</text>
            <text className="id-profile-calc__svg-label" textAnchor="end" x="310" y={bottom + 5}>{format(input.depth, 0)}</text>
            <text className="id-profile-calc__svg-note" textAnchor="middle" x="150" y="282">hloubka v cm (≈)</text>
          </svg>
          {input.mode === 'keep' && <p className="id-profile-calc__drawing-note">
            {typography('Šrafování: objem k odvozu ' + volume(calculation.removeM3) + '.')}
          </p>}
        </div>
        <div className="id-profile-calc__profile">
          <h4>{input.mode === 'mix' ? 'Po zapravení' : 'Připravená směs'}</h4>
          <p className="id-profile-calc__sr" id={uid + '-zones-description'}>{typography(zonesDescription)}</p>
          <svg aria-describedby={uid + '-zones-description'} aria-label={chartLabel} role="img" viewBox="0 0 320 292">
            <rect fill="#54402c" height="24" width="220" x="40" y={bottom} />
            {calculation.zones.map((zone) => {
              let x = 40
              const y = top + zone.from * scale
              const height = (zone.to - zone.from) * scale
              return (
                <g key={zone.from + '-' + zone.to}>
                  {MATERIALS.map((material) => {
                    const width = zone.litresPer100[material] * 2.2
                    const start = x
                    x += width
                    return width > 0 ? <rect
                      fill={MATERIAL_COLORS[material]}
                      height={height}
                      key={material}
                      width={width}
                      x={start}
                      y={y}
                    /> : null
                  })}
                  {zone.from > 0 && <>
                    <line stroke="#fff" strokeDasharray="4 5" strokeWidth="1.6" x1="40" x2="260" y1={y} y2={y} />
                    {height >= 25 && y - top >= 25 && bottom - y >= 25 && (
                      <text className="id-profile-calc__svg-label" textAnchor="end" x="310" y={y + 5}>{format(zone.from, 1)}</text>
                    )}
                  </>}
                </g>
              )
            })}
            <rect fill="none" height={finalDepth * scale} stroke="#232830" strokeWidth="1.6" width="220" x="40" y={top} />
            <line stroke="#3f7d4e" strokeWidth="4" x1="40" x2="260" y1={top} y2={top} />
            <text className="id-profile-calc__svg-label" textAnchor="end" x="310" y={top + 5}>0</text>
            <text className="id-profile-calc__svg-label" textAnchor="end" x="310" y={bottom + 5}>{format(finalDepth, 0)}</text>
            <text className="id-profile-calc__svg-note" textAnchor="middle" x="150" y="282">hloubka v cm (≈)</text>
          </svg>
        </div>
      </div>
      <ul className="id-profile-calc__legend" aria-label="Barvy složek">
        {MATERIALS.map((material) => <li key={material}>
          <span aria-hidden="true" style={{ backgroundColor: MATERIAL_COLORS[material] }} />
          {MATERIAL_NAMES[material]}
        </li>)}
      </ul>
      <figcaption>
        Složky se v každé zóně promíchávají. Barevné pruhy ukazují objemové podíly,
        nikoli oddělené vrstvy materiálů. Řez zobrazuje čistou recepturu bez objednávkové rezervy;
        výslednou výšku po slehnutí ověřte na místě.
      </figcaption>
    </figure>
  )
}

export function SoilProfileCalculator({ className, surface }: { className?: string; surface?: string | null }) {
  const uid = useId().replace(/:/g, '')
  const [raw, setRaw] = useState<RawNumbers>(initialRaw)
  const [mode, setMode] = useState<Mode>(INPUT_DEFAULTS.mode)
  const [soil, setSoil] = useState<Soil>(INPUT_DEFAULTS.soil)
  const [currency, setCurrency] = useState<Currency>(INPUT_DEFAULTS.currency)
  const [prices, setPrices] = useState<RawPrices>(initialPrices)
  const [announcement, setAnnouncement] = useState('')
  const [pricesOpen, setPricesOpen] = useState(false)
  const pricesDetails = useRef<HTMLDetailsElement>(null)

  const input = useMemo<SoilProfileInput>(() => ({
    ...Object.fromEntries(NUMBER_KEYS.map((key) => [key, (key === 'area' || key === 'depth') && raw[key].trim() === '' ? 0 : parseNumber(raw[key])])) as Record<NumberKey, number>,
    mode, soil, currency,
    prices: Object.fromEntries(MATERIALS.map((key) => [key, prices[currency][key].trim() === '' ? 0 : parseNumber(prices[currency][key])])) as SoilProfileInput['prices'],
  }), [raw, mode, soil, currency, prices])
  const calculation = useMemo(() => calculateSoilProfile(input), [input])
  const ready = calculation.status === 'ready'
  const hasEnteredPrices = MATERIALS.some((material) => parseNumber(prices[currency][material]) > 0)
  const issueFor = (field: string) => calculation.issues.find((issue) =>
    issue.field === field && issue.severity === 'error',
  )?.message

  const purchaseAmount = (material: Amendment) => {
    const quantity = calculation.delivery[material]
    return ready ? format(material === 'char' ? quantity.litres : quantity.kg, 1) : '—'
  }

  const summary = ready
    ? 'Písek k objednání: ' + volume(calculation.delivery.sand.m3)
      + ', přibližně ' + mass(calculation.delivery.sand.kg)
      + (mode === 'new' ? '. Zemina k objednání: ' + volume(calculation.delivery.soil.m3)
        + ', přibližně ' + mass(calculation.delivery.soil.kg) : '')
      + '. ' + (['biovin', 'zeolit', 'char'] as const).map((material) =>
        MATERIAL_NAMES[material] + ' k objednání: ' + purchaseAmount(material) + ' ' + PRICE_UNITS[material],
      ).join(', ')
      + '. Modelová výška profilu ' + format(calculation.finalDepth) + ' centimetrů. '
      + (mode === 'keep' ? 'Zemina k odvozu ' + volume(calculation.removeM3) + '. ' : '')
      + (calculation.hasPrices ? 'Zadané ceny materiálů celkem ' + money(calculation.totalCost, currency) + '.' : 'Ceny zatím nejsou zadané.')
      + (calculation.issues.length ? ' ' + calculation.issues.map((issue) => issue.message).join(' ') : '')
    : calculation.issues.map((issue) => issue.message).join(' ') || 'Zadejte plochu a hloubku.'

  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(summary), 400)
    return () => window.clearTimeout(timer)
  }, [summary])

  const updateNumber = (key: NumberKey, value: string) => {
    setRaw((previous) => ({ ...previous, [key]: value }))
    if (['ratio', 'biovin', 'char', 'zeolit'].includes(key)) setSoil('vlastni')
  }
  const changeSoil = (nextSoil: Soil) => {
    setSoil(nextSoil)
    if (nextSoil === 'vlastni') return
    const preset = SOIL_PRESETS[nextSoil]
    setRaw((previous) => ({
      ...previous,
      ratio: String(preset.ratio).replace('.', ','),
      biovin: String(preset.biovin).replace('.', ','),
      zeolit: String(preset.zeolit).replace('.', ','),
      char: String(preset.char).replace('.', ','),
    }))
  }
  const openPrices = () => {
    if (!pricesDetails.current) return
    setPricesOpen(true)
    pricesDetails.current.open = true
    window.requestAnimationFrame(() => pricesDetails.current?.querySelector<HTMLInputElement>('input[type="text"]')?.focus())
  }
  const field = (key: NumberKey, label: string, unit: string, hint?: string, prominent = false, context?: string) => (
    <NumberField
      context={context}
      error={issueFor(key)}
      hint={hint}
      id={uid + '-' + key}
      key={key}
      label={label}
      onChange={(value) => updateNumber(key, value)}
      prominent={prominent}
      unit={unit}
      value={raw[key]}
    />
  )

  const purchaseQuantity = (material: Amendment) => (
    <div className="id-profile-calc__purchase">
      <label htmlFor={uid + '-purchase-' + material}>K objednání</label>
      <output
        aria-label={'K objednání — ' + MATERIAL_NAMES[material]}
        aria-live="off"
        className="id-profile-calc__purchasevalue"
        htmlFor={['area', 'depth', 'ratio', material, material + 'Depth', 'loss', material === 'biovin' ? 'rhoB' : material === 'zeolit' ? 'rhoZe' : 'rhoC'].map((key) => uid + '-' + key).join(' ')}
        id={uid + '-purchase-' + material}
      >
        <strong>{purchaseAmount(material)}</strong>
        <span> {PRICE_UNITS[material]}</span>
      </output>
    </div>
  )

  return (
    <section
      aria-labelledby={uid + '-title'}
      className={['id-profile-calc', 'not-prose', surface === 'band' ? 'id-profile-calc--band id-band' : 'id-edge', className].filter(Boolean).join(' ')}
    >
      <noscript>
        <p className="id-profile-calc__noscript">
          Pro přepočet zapněte JavaScript. Popis režimů, zadání a vysvětlení výpočtu zůstávají dostupné níže.
        </p>
      </noscript>
      <div className="id-profile-calc__panel" data-surface="dark">
        <header className="id-profile-calc__heading">
          <div>
            <p className="id-profile-calc__eyebrow">Půdní profil</p>
            <h2 id={uid + '-title'}>Základní směs — kolik navézt</h2>
          </div>
          <span className="id-profile-calc__tag">Kalkulátor</span>
        </header>

        <div className="id-profile-calc__inputs" role="group" aria-labelledby={uid + '-inputs-title'}>
          <h3 className="id-profile-calc__parttitle" id={uid + '-inputs-title'}>Zadání</h3>
          <AlignedInputColumns>
            <div className="id-profile-calc__basics">
              <Choices
                legend="Co dělám"
                name={uid + '-mode'}
                onChange={setMode}
                options={[
                  { value: 'keep', label: 'Udržet výšku' },
                  { value: 'mix', label: 'Zapravit' },
                  { value: 'new', label: 'Nová vrstva' },
                ]}
                value={mode}
              />
              <p className="id-profile-calc__modehint">{typography(MODE_HINTS[mode])}</p>
              <p className="id-profile-calc__hint id-profile-calc__example">Výchozí model: 100 m² a 30 cm. Přepište jej podle své zahrady.</p>
              <div className="id-profile-calc__fieldgrid">
                {field('area', 'Plocha', 'm²', 'Velikost upravované plochy.', true)}
                {field('depth', mode === 'mix' ? 'Původní hloubka' : 'Hloubka profilu', 'cm', 'Model v článku pracuje s 30 cm.', true)}
              </div>
              <Choices
                legend="Typ půdy"
                name={uid + '-soil'}
                onChange={changeSoil}
                options={[
                  { value: 'jil', label: 'Jílovitá' },
                  { value: 'hlina', label: 'Hlinitá' },
                  { value: 'pisek', label: 'Písčitá' },
                  { value: 'vlastni', label: 'Vlastní' },
                ]}
                value={soil}
              />
              <p className="id-profile-calc__hint">{typography(SOIL_HINTS[soil])}</p>
              <p className="id-profile-calc__hint">
                Předvolby nastaví dolní hranice rozsahů příměsí. Úpravou poměru nebo příměsí přejdete na vlastní recepturu.
              </p>

              <div className="id-profile-calc__ratio">
                <label htmlFor={uid + '-ratio'}>Poměr písek : zemina</label>
                <output aria-live="off" htmlFor={uid + '-ratio'}>
                  {format(input.ratio, 0)} : {format(100 - input.ratio, 0)}
                </output>
                <input
                  aria-describedby={[uid + '-ratio-hint', issueFor('ratio') && uid + '-ratio-error'].filter(Boolean).join(' ')}
                  aria-invalid={Boolean(issueFor('ratio'))}
                  aria-valuetext={format(input.ratio, 0) + ' procent písku a ' + format(100 - input.ratio, 0) + ' procent zeminy v minerálním základu'}
                  id={uid + '-ratio'}
                  max={100}
                  min={0}
                  onChange={(event) => updateNumber('ratio', event.target.value)}
                  step={5}
                  style={{ '--pct': (Number.isFinite(input.ratio) ? input.ratio : 0) + '%' } as React.CSSProperties}
                  type="range"
                  value={Number.isFinite(input.ratio) ? input.ratio : 0}
                />
                <p className="id-profile-calc__hint" id={uid + '-ratio-hint'}>
                  Příměsi si vezmou místo jako první. Zbytek objemu je minerální základ dělený tímto poměrem.
                </p>
                {issueFor('ratio') && <p className="id-profile-calc__error" id={uid + '-ratio-error'}>{issueFor('ratio')}</p>}
              </div>
            </div>

            <fieldset className="id-profile-calc__additions">
              <legend>Příměsi a hloubka zapravení</legend>
              <p className="id-profile-calc__hint">
                Podíl počítáme z objemu půdy od povrchu do zadané hloubky. Každou příměs můžete zapravit jinak hluboko.
              </p>
              <div className="id-profile-calc__additionlist">
                <fieldset className="id-profile-calc__amendment">
                  <legend>Písek</legend>
                  <p className="id-profile-calc__hint" id={uid + '-sand-hint'}>
                    Zbytek minerálního základu po odečtení příměsí, podle zvoleného poměru.
                  </p>
                  <div className="id-profile-calc__purchase">
                    <label htmlFor={uid + '-sand-amount'}>K objednání</label>
                    <output
                      aria-describedby={uid + '-sand-hint'}
                      aria-label="K objednání — Písek"
                      aria-live="off"
                      className="id-profile-calc__purchasevalue"
                      htmlFor={['area', 'depth', 'ratio', 'loss', 'rhoS'].map((key) => uid + '-' + key).join(' ')}
                      id={uid + '-sand-amount'}
                    >
                      <strong>{ready ? format(calculation.delivery.sand.tonnes) : '—'}</strong>
                      <span> t</span>
                    </output>
                  </div>
                </fieldset>
                <fieldset className="id-profile-calc__amendment">
                  <legend>Actino <span>(dříve Biovin)</span></legend>
                  <div className="id-profile-calc__additiongrid">
                    {field('biovin', 'Podíl', '%', undefined, false, 'Actino')}
                    {field('biovinDepth', 'Do hloubky', 'cm', undefined, false, 'Actino')}
                    {purchaseQuantity('biovin')}
                  </div>
                </fieldset>
                <fieldset className="id-profile-calc__amendment">
                  <legend>Zeolit</legend>
                  <div className="id-profile-calc__additiongrid">
                    {field('zeolit', 'Podíl', '%', undefined, false, 'Zeolit')}
                    {field('zeolitDepth', 'Do hloubky', 'cm', undefined, false, 'Zeolit')}
                    {purchaseQuantity('zeolit')}
                  </div>
                </fieldset>
                <fieldset className="id-profile-calc__amendment">
                  <legend>Biochar <span>(nabitý)</span></legend>
                  <div className="id-profile-calc__additiongrid">
                    {field('char', 'Podíl', '%', undefined, false, 'Biochar')}
                    {field('charDepth', 'Do hloubky', 'cm', undefined, false, 'Biochar')}
                    {purchaseQuantity('char')}
                  </div>
                </fieldset>
              </div>
              <p className="id-profile-calc__hint">
                Kilogramy jsou orientační podle nastavených hustot.
                {input.loss > 0 && typography(' Množství k objednání zahrnuje rezervu ' + format(input.loss) + ' %.')}
              </p>
            </fieldset>
          </AlignedInputColumns>
        </div>

        <div className="id-profile-calc__results" role="group" aria-labelledby={uid + '-results-title'}>
          <div className="id-profile-calc__resultshead">
            <h3 className="id-profile-calc__parttitle" id={uid + '-results-title'}>Výsledek</h3>
            <div className="id-profile-calc__primary">
              <span>Písek k objednání</span>
              <strong>{ready ? typography(volume(calculation.delivery.sand.m3)) : '—'}</strong>
              <p>{ready ? typography('≈ ' + mass(calculation.delivery.sand.kg)) : calculation.status === 'invalid' ? 'Opravte označené údaje.' : 'Doplňte plochu a hloubku.'}</p>
            </div>
          </div>
          <MaterialTable calculation={calculation} currency={currency} ready={ready} showPrices={hasEnteredPrices || pricesOpen} />
          <dl className="id-profile-calc__totals">
            {mode === 'keep' && <>
              <div>
                <dt>Zemina k odvozu</dt>
                <dd>{ready ? typography(volume(calculation.removeM3)) : '—'}
                  <small>{ready ? typography('≈ ' + mass(calculation.removeM3 * input.rhoZ * 1000)) : '—'}</small>
                </dd>
              </div>
              <div><dt>Zemina ponechaná na místě</dt><dd>{ready ? typography(volume(calculation.keepM3)) : '—'}</dd></div>
            </>}
            {mode === 'mix' && <>
              <div><dt>Zemina ponechaná na místě</dt><dd>{ready ? typography(volume(calculation.keepM3)) : '—'}</dd></div>
              <div><dt>Zvýšení terénu</dt><dd>{ready ? typography('+ ' + format(calculation.rise) + ' cm') : '—'}</dd></div>
            </>}
            <div><dt>Modelová výška</dt><dd>{ready ? typography(format(calculation.finalDepth) + ' cm') : '—'}
              <small>{ready ? typography(volume(calculation.finalVolume) + ' surovin pro profil') : '—'}</small>
            </dd></div>
            <div className={cn('id-profile-calc__cost', ready && calculation.hasPrices && 'id-profile-calc__cost--set')}>
              <dt>{!ready || calculation.missingPrices.length ? 'Součet zadaných cen' : 'Materiál celkem'}</dt>
              <dd>{ready ? calculation.hasPrices ? typography(money(calculation.totalCost, currency)) : 'Ceny nezadané' : '—'}</dd>
            </div>
          </dl>
          <button className="id-profile-calc__textbutton" onClick={openPrices} type="button">
            {hasEnteredPrices ? 'Upravit ceny materiálů' : 'Zadat ceny materiálů'} <span aria-hidden="true">↓</span>
          </button>
          {ready && <>
            <p className="id-profile-calc__hint">
              {calculation.hasPrices
                ? typography('Bez dopravy a odvozu. ' + (calculation.missingPrices.length
                  ? 'Neoceněné materiály: ' + calculation.missingPrices.map((key) => MATERIAL_NAMES[key]).join(', ') + '.'
                  : 'Cena zahrnuje všechny dovážené materiály.'))
                : 'Množství platí i bez cen. Nulová cena se do součtu nezahrnuje.'}
            </p>
            {input.loss > 0 && <p className="id-profile-calc__hint">
              {typography('Objednávka obsahuje rezervu ' + format(input.loss) + ' %. Rezerva navyšuje jen dovážený materiál.')}
            </p>}
            {calculation.delivery.sand.kg > 0 && <p className="id-profile-calc__transport">
              {typography('Dovoz písku: ' + format(calculation.sandTransport.bigBags1t, 0)
                + '× big bag po 1 t, nebo ' + format(calculation.sandTransport.bags25kg, 0)
                + ' pytlů po 25 kg, nebo ' + format(calculation.sandTransport.trucks3t, 0)
                + ' nákladů po 3 t.')}
            </p>}

          </>}
          {calculation.issues.length > 0 && (
            <ul className="id-profile-calc__issues">
              {calculation.issues.map((issue, index) => <li key={issue.code + '-' + index}>{typography(issue.message)}</li>)}
            </ul>
          )}
          {ready && calculation.issues.length === 0 && (
            <div aria-live="polite" className="id-verdict id-verdict--ok" role="status">
              <Ok />
              <span>Zadání je konzistentní. Materiály jsou připravené k objednání.</span>
            </div>
          )}

        </div>

        <details className="id-profile-calc__details" onToggle={(event) => setPricesOpen(event.currentTarget.open)} ref={pricesDetails}>
          <summary>Ceny materiálů <span>{hasEnteredPrices ? SYMBOLS[currency] : 'zatím nezadané'}</span></summary>
          <div className="id-profile-calc__detailsbody">
            <Choices
              legend="Měna"
              name={uid + '-currency'}
              onChange={setCurrency}
              options={CURRENCIES.map((value) => ({ value, label: SYMBOLS[value] }))}
              value={currency}
            />
            <div className="id-profile-calc__pricegrid">
              {MATERIALS.map((material) => <NumberField
                error={issueFor('prices.' + material)}
                hint={material === 'char' ? 'Nabitý biochar, cena za litr.' : material === 'biovin' ? 'Actino (dříve Biovin), cena za kilogram.' : undefined}
                id={uid + '-price-' + material}
                key={material}
                label={MATERIAL_NAMES[material]}
                onChange={(value) => setPrices((previous) => ({
                  ...previous,
                  [currency]: { ...previous[currency], [material]: value },
                }))}
                unit={SYMBOLS[currency] + '/' + PRICE_UNITS[material]}
                value={prices[currency][material]}
              />)}
            </div>
            <p className="id-profile-calc__hint">
              Každá měna má vlastní ceník. Přepnutí měny neprovádí kurzový přepočet;
              po přepnutí zpět zůstávají vaše ceny zachované do obnovení stránky.
              Zadejte ceny dodavatele; dopravu a odvoz zeminy kalkulátor neoceňuje.
            </p>
          </div>
        </details>

        <details className="id-profile-calc__details">
          <summary>Podrobnosti o směsi <span>rezerva a hustoty</span></summary>
          <div className="id-profile-calc__detailsbody">
            <div className="id-profile-calc__detailgrid">
              {field('loss', 'Rezerva na sesednutí', '%', 'Výchozí 0 %. Dovoz = čistá receptura ÷ (1 − rezerva).')}
              {field('rhoS', 'Hustota písku', 'kg/l', 'Výchozí 1,50 kg/l; ověřte u dodavatele.')}
              {field('rhoZ', 'Hustota zeminy', 'kg/l', 'Výchozí 1,40 kg/l; půdy se liší.')}
              {field('rhoZe', 'Hustota zeolitu', 'kg/l', 'Výchozí 0,80 kg/l; sypná hustota.')}
              {field('rhoB', 'Hustota Actina', 'kg/l', 'Výchozí 0,60 kg/l; podklady uvádějí 0,60–0,65.')}
              {field('rhoC', 'Hustota biocharu', 'kg/l', '0,20 kg/l je počtový předpoklad. Vlhký výrobek může být těžší; cenu zadávejte za litr.')}
            </div>
          </div>
        </details>

        <details className="id-profile-calc__details">
          <summary>Jak výpočet číst</summary>
          <div className="id-profile-calc__help">
            <p><strong>Objem je základ.</strong> Plocha v m² × hloubka v cm ÷ 100 dává objem vrstvy v m³.
              Procenta příměsí se počítají z objemu příslušné zóny. Poměr písek : zemina se uplatní až na zbývající minerální základ.</p>
            <p><strong>Udržet výšku:</strong> odváží se část původní zeminy, kterou nahradí nové složky.
              <strong> Zapravit:</strong> zemina zůstává a dovoz zvyšuje objem i výšku profilu.
              <strong> Nová vrstva:</strong> nakupují se všechny složky včetně zeminy.</p>
            <p><strong>Hustota mění hmotnost, nikoli poměr.</strong> Litr materiálu vynásobený sypnou hustotou v kg/l
              dává kilogramy. Pro objednávku hmotnost ověřte u dodavatele.</p>
            <p><strong>Každá příměs má vlastní hloubku.</strong> Nastavíte ji vedle jejího podílu, vždy od povrchu.
              Pokud je profil mělčí, započítáme příměs jen do skutečné hloubky profilu.
              V režimu Zapravit se hloubka měří od nového povrchu.</p>
            <p><strong>Rezerva patří k objednávce.</strong> Zeminu ponechanou na místě nezvětšuje.
              Receptura a řez zůstávají v čistých objemech; slehnutí a výslednou výšku ověřte při realizaci.</p>
            <p>Předvolby jsou výchozí modelové receptury. Vhodnost písku, příměsí a konkrétního poměru závisí na půdě,
              podloží a vlastnostech dodaných materiálů. Před úpravou celé plochy ověřte směs na menším vzorku.</p>
          </div>
        </details>
      </div>

      <ProfileDrawing calculation={calculation} input={input} uid={uid} />
      <p aria-atomic="true" aria-live="polite" className="id-profile-calc__sr" role="status">
        {typography(announcement)}
      </p>
    </section>
  )
}
