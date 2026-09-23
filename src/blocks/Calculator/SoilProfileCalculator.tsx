'use client'

import React, { useDeferredValue, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { nezlomitelneMezery, plural } from '@/utilities/czechTypography'
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
      <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  </span>
)

type Mode = SoilProfileInput['mode']
type Soil = SoilProfileInput['soil']
type Currency = SoilProfileInput['currency']
type Material = keyof SoilProfileInput['prices']
type Result = ReturnType<typeof calculateSoilProfile>
type Section = 'results' | 'prices' | 'details' | 'help'

const NUMBER_KEYS = [
  'area', 'depth', 'ratio', 'biovin', 'zeolit', 'char', 'biovinDepth', 'zeolitDepth', 'charDepth',
  'loss', 'rhoS', 'rhoZ', 'rhoB', 'rhoZe', 'rhoC',
] as const
type NumberKey = typeof NUMBER_KEYS[number]
type RawNumbers = Record<NumberKey, string>
type RawPrices = Record<Currency, Record<Material, string>>

/* Pole, která se montují teprve s otevřenou sekcí „Podrobnosti o směsi".
   Jeden seznam slouží k vykreslení panelu i k sestavení `output[for]`;
   kdyby se ty dva rozešly, vznikly by odkazy na id mimo dokument. */
const DETAIL_FIELDS: Array<[NumberKey, string, string, string]> = [
  ['loss', 'Rezerva na sesednutí', '%', 'Výchozí 0 %. Dovoz = čistá receptura ÷ (1 − rezerva).'],
  ['rhoS', 'Hustota písku', 'kg/l', 'Výchozí 1,50 kg/l; ověřte u dodavatele.'],
  ['rhoZ', 'Hustota zeminy', 'kg/l', 'Výchozí 1,40 kg/l; půdy se liší.'],
  ['rhoZe', 'Hustota zeolitu', 'kg/l', 'Výchozí 0,80 kg/l; sypná hustota.'],
  ['rhoB', 'Hustota Actina', 'kg/l', 'Výchozí 0,60 kg/l; podklady uvádějí 0,60–0,65.'],
  ['rhoC', 'Hustota biocharu', 'kg/l', '0,20 kg/l je počtový předpoklad. Vlhký výrobek může být těžší; cenu zadávejte za litr.'],
]
const DETAIL_KEYS: string[] = DETAIL_FIELDS.map(([key]) => key)

const MATERIALS: Material[] = ['sand', 'soil', 'char', 'biovin', 'zeolit']
const MATERIAL_NAMES: Record<Material, string> = {
  sand: 'Písek', soil: 'Zemina', char: 'Biochar', biovin: 'Actino', zeolit: 'Zeolit',
}
const SYMBOLS: Record<Currency, string> = { CZK: 'Kč', EUR: '€', USD: '$', GBP: '£' }
const CURRENCIES: Currency[] = ['CZK', 'EUR', 'USD', 'GBP']
const PRICE_UNITS: Record<Material, string> = {
  sand: 't', soil: 't', char: 'l', biovin: 'kg', zeolit: 'kg',
}
const MODE_HINTS: Record<Mode, string> = {
  keep: 'Část zeminy předem odvezete. Písek a příměsi pak nahradí její objem, aby zadaná výška terénu zůstala.',
  mix: 'Písek a příměsi zapravíte do zeminy, kterou neodvážíte. Profil proto bude vyšší a zóny se počítají od nového povrchu.',
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
/* Názvy materiálů uvnitř věty: malým písmenem, jen obchodní název Actino
   zůstává s velkým A. Tvary pád podle místa ve větě. */
const MATERIAL_WORD: Record<Material, { nom: string; acc: string; gen: string }> = {
  sand: { nom: 'písek', acc: 'písek', gen: 'písku' },
  soil: { nom: 'zemina', acc: 'zeminu', gen: 'zeminy' },
  char: { nom: 'biochar', acc: 'biochar', gen: 'biocharu' },
  biovin: { nom: 'Actino', acc: 'Actino', gen: 'Actina' },
  zeolit: { nom: 'zeolit', acc: 'zeolit', gen: 'zeolitu' },
}

/* Balení nabízíme jen v rozsahu, ve kterém se opravdu objednává: pytle do dvou
   palet, big bag od jednoho celého kusu do deseti (výš už je to sklápěč),
   sklápěč od jednoho plného nákladu.
   Dřív nabídka hlásila 1 141 pytlů u 28,5 t i celý sklápěč u 365 kg písku. */
const sandDeliveryOptions = ({ delivery, sandTransport }: Result): string[] => {
  const tonnes = delivery.sand.tonnes
  return [
    tonnes >= 1 && tonnes <= 10 ? plural(sandTransport.bigBags1t, 'big bag', 'big bagy', 'big bagů') + ' po 1 t' : '',
    tonnes <= 2 ? plural(sandTransport.bags25kg, 'pytel', 'pytle', 'pytlů') + ' po 25 kg' : '',
    tonnes >= 3 ? plural(sandTransport.trucks3t, 'sklápěč', 'sklápěče', 'sklápěčů') + ' po 3 t' : '',
  ].filter(Boolean)
}

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

/**
 * Nápověda, která se mění s ovladačem nad sebou, nesmí hýbat ovladačem
 * pod sebou (DESIGN.md 6.8: finální layout box od prvního paintu).
 * Varianty proto leží všechny v jednom poli mřížky, takže blok je vysoký
 * jako nejdelší z nich při AKTUÁLNÍ šířce okna. Kde se věty vejdou na
 * stejný počet řádků (naměřeno od 430 px výš), nezůstane žádné prázdné
 * místo; pevné `min-height` by šířku nevidělo a díru udělalo vždy.
 */
function HintStack<T extends string>({ className, options, value }: {
  className: string
  options: Record<T, string>
  value: T
}) {
  return (
    <div className="id-profile-calc__hintstack">
      {(Object.keys(options) as T[]).map((key) => (
        <p aria-hidden={key === value ? undefined : true} className={className} key={key}>
          {typography(options[key])}
        </p>
      ))}
    </div>
  )
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
  const depthFor = (material: Material): number | null => {
    if (!ready) return null
    /* Co se nedováží, nemá hloubku dovozu — dřív tu Zemina hlásila 86,46 cm u 0 l. */
    if (calculation.delivery[material].m3 <= 0) return null
    if (material === 'sand' || material === 'soil') return calculation.finalDepth
    return calculation.incorporationDepths[material]
  }
  return (
    <table className="id-profile-calc__table" role="table">
      <caption>Materiály k objednání</caption>
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">Materiál</th>
          <th role="columnheader" scope="col">Do hloubky</th>
          <th role="columnheader" scope="col">Objem</th>
          <th role="columnheader" scope="col">Hmotnost ≈</th>
          {showPrices && <th role="columnheader" scope="col">Cena</th>}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {MATERIALS.map((material) => {
          const quantity = calculation.delivery[material]
          const depth = depthFor(material)
          return (
            <tr key={material} role="row">
              <th role="rowheader" scope="row">{MATERIAL_NAMES[material]}</th>
              <td role="cell">
                <span className="id-profile-calc__mobilelabel">Do hloubky</span>
                <span>{depth != null ? typography(format(depth) + ' cm') : '—'}</span>
              </td>
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

/* Tři způsoby přípravy téhož profilu vedle sebe, každý jako před → po ve
   společném měřítku. Kresba záměrně neukazuje složení směsi (to nese výsledek
   kalkulátoru) — jen to, čím se způsoby liší: co se odveze, co se doveze a jak
   se změní výška terénu. Zvolený způsob je zvýrazněný. */
const MODE_ORDER: Mode[] = ['keep', 'mix', 'new']
const MODE_TITLES: Record<Mode, string> = { keep: 'Udržet výšku', mix: 'Zapravit', new: 'Nová vrstva' }
/** Jediný zdroj popisků: přepínač v zadání i přepínač nad kresbou musí říkat totéž. */
const MODE_OPTIONS = MODE_ORDER.map((value) => ({ value, label: MODE_TITLES[value] }))
/* `drn`: travní pás nad hmotou. 9 j. se při měřítku kresby (320 j. → 480 px)
   vykreslí 13,5 px na 1440 a 9,9 px na 393 — tedy stejně silně jako drn
   v ostatních řezech článku (TriZony, TricetCentimetru: 14 / 9,9 px). */
const PANEL = { before: 14, after: 178, width: 130, terrain: 130, strip: 16, height: 268, drn: 9 }

function ProfileDrawing({ calculation, input, onModeChange, uid }: {
  calculation: Result
  input: SoilProfileInput
  onModeChange: (mode: Mode) => void
  uid: string
}) {
  /* Ostatní dva způsoby se počítají ze stejného zadání, jen s jiným režimem —
     výpočet je levný, drahé bylo jen dřívější vykreslování složení. */
  const variants = useMemo(() => Object.fromEntries(MODE_ORDER.map((mode) => [
    mode, mode === input.mode ? calculation : calculateSoilProfile({ ...input, mode }),
  ])) as Record<Mode, Result>, [calculation, input])
  /* Kresba se řídí ZVOLENÝM způsobem. Dřív se vypínala, když kterýkoli ze tří
     způsobů neplatil — při 100 % písku tak platný „Udržet výšku" zhasl kvůli
     „Zapravit" a panel vedle něj přitom hlásil konzistentní zadání. */
  if (calculation.status !== 'ready') {
    /* Když zadání sedí a neplatí jen zvolený způsob, ovládání nesmí zmizet
       spolu s kresbou a výzva nesmí žádat doplnění hotového zadání. */
    const chyba = calculation.issues.find((issue) => issue.severity === 'error')
    return (
      <section className="id-profile-calc__drawing id-profile-calc__drawing--empty">
        <h3>Jak se profil změní</h3>
        {/* Na způsobu závisí jen chyba poměru; u chyby pole přepínač nepomůže
            a věta o způsobu posílala čtenáře k němu (porota 12). */}
        <p>{typography(!chyba
          ? 'Doplňte platné zadání. Řez pak ukáže, co se u zvoleného způsobu odveze, co se doveze a jak se změní výška terénu.'
          : chyba.code === 'mix-ratio'
            ? chyba.message + ' Řez se vrátí, jakmile bude zvolený způsob pro toto zadání platit.'
            : chyba.message + ' Řez se vrátí, až údaj opravíte.')}</p>
        <Choices
          legend="Způsob přípravy"
          name={uid + '-drawing-mode'}
          onChange={onModeChange}
          options={MODE_OPTIONS}
          value={input.mode}
        />
      </section>
    )
  }
  const depth = input.depth
  /* Navýšení terénu je vlastnost „Zapravit"; když ten pro dané zadání neplatí,
     nesmí svým neplatným číslem určovat měřítko ostatních dvou způsobů. */
  const rise = variants.mix.status === 'ready' ? Math.max(0, variants.mix.rise) : 0
  /* Společné měřítko: hloubka se vejde do 90 jednotek, navýšení terénu do 120. */
  const scale = Math.min(90 / Math.max(depth, 1), 120 / Math.max(rise, 1))
  const terrain = PANEL.terrain
  const bottom = terrain + depth * scale
  const removedHeight = variants.keep.initialVolume > 0
    ? depth * scale * variants.keep.removeM3 / variants.keep.initialVolume
    : 0
  /* Co se v kresbě pro zvolený způsob opravdu vykreslí. Texty i legenda se
     řídí těmito příznaky — dřív slibovaly šrafu a kótu i tam, kde v kresbě
     žádné nebyly (nulový odvoz, nulové navýšení). */
  const dovazene = MATERIALS.filter((material) => calculation.delivery[material].m3 > 0)
  const importedM3 = dovazene.reduce((sum, material) => sum + calculation.delivery[material].m3, 0)
  /* Blok „po" je směs jen tehdy, když má aspoň dvě složky (ponechaná zemina
     se počítá). Čistou zeminu v Nové vrstvě nebo čistý písek po úplném odvozu
     dřív řez nazýval „promíchanou směsí". */
  const ponechanaZemina = input.mode !== 'new' && calculation.keepM3 > 0
  const pocetSlozek = (ponechanaZemina ? 1 : 0) + dovazene.length
  const blended = importedM3 > 0 && pocetSlozek >= 2
  const jediny: Material | null = !blended && dovazene.length === 1 && !ponechanaZemina ? dovazene[0] : null
  /* Směs bez jakékoli zeminy (100 % písku + příměsi) stála na hnědém podkladu
     ornice, i když v ní žádná zemina není (porota 12, 9.2 p. 10): podklad je
     pak písek a zrna příměsí tmavá. */
  const smesBezZeminy = blended && !ponechanaZemina && !dovazene.includes('soil')
  /* Závorka legendy vypisuje jen to, co se opravdu dováží — „zemina + písek +
     příměsi“ lhalo, kdykoli byl některý podíl nulový (porota 08, slop). */
  const slozkySmesi = [
    ...(input.mode !== 'new' && calculation.keepM3 > 0
      ? [input.mode === 'keep' ? 'zbylá zemina' : 'stávající zemina']
      : []),
    ...dovazene.map((material) => MATERIAL_WORD[material].nom),
  ].join(' + ')
  const removes = input.mode === 'keep' && removedHeight > 0
  /* Navýšení se posuzuje zaokrouhlené, jak ho kresba vypíše: při 0,02 cm
     kóta hlásila „+0 cm“ a komentář „vystoupí o výšku kóty“ (porota 12). */
  const vyskaNavyseni = format(rise, 1)
  const lifts = input.mode === 'mix' && vyskaNavyseni !== '0'

  /* Materiály jmenujeme podle skutečného dovozu, ne podle šablony. */
  const vycet = (slova: string[]) => slova.join(', ').replace(/, ([^,]*)$/, ' a $1')
  const dovoz = dovazene.length ? vycet(dovazene.map((material) => MATERIAL_WORD[material].acc)) : 'nic'
  /* Kam co patří. Písek a zemina tvoří minerální základ v celé hloubce,
     příměsi jen svou zónu od povrchu. Komentář dřív tvrdil, že se příměsi
     zapraví „do celé stávající zeminy“, a čtenář by je rozmíchal do celých
     30 cm, tedy 2–3× zředěné proti výpočtu (porota 12, slop). */
  const velke = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
  const zaklad = dovazene.filter((material) => material === 'sand' || material === 'soil')
  const zony = [...dovazene.filter((material): material is Amendment => material !== 'sand' && material !== 'soil')
    .reduce((skupiny, material) => {
      const hloubka = calculation.incorporationDepths[material]
      const celou = hloubka >= calculation.finalDepth - 0.005
      const klic = celou ? 'celou' : format(hloubka)
      const skupina = skupiny.get(klic) ?? { hloubka, celou, slova: [] as string[] }
      skupina.slova.push(MATERIAL_WORD[material].nom)
      return skupiny.set(klic, skupina)
    }, new Map<string, { hloubka: number; celou: boolean; slova: string[] }>()).values()]
    .sort((a, b) => a.hloubka - b.hloubka)
  const zakladVeta = zaklad.length === 0
    ? ''
    : input.mode === 'mix'
      ? 'Písek zapravíte do celé stávající zeminy'
      : input.mode === 'keep' && calculation.keepM3 > 0
        ? (zaklad.includes('sand') ? 'Písek promícháte se zbylou zeminou v celé hloubce' : '')
        : velke(vycet(zaklad.map((material) => MATERIAL_WORD[material].acc))) + ' navezete v celé hloubce'
  /* „Actino a biochar zapravíte 10 cm hluboko, zeolit 15 cm“ — sloveso jen
     u první zóny, a jen když ho už nenese věta o písku. */
  const zonyText = zony.map((zona, index) => vycet(zona.slova)
    + (index === 0 && !zakladVeta ? ' zapravíte ' : ' ')
    + (zona.celou ? 'po celé hloubce' : format(zona.hloubka) + ' cm' + (index === 0 ? ' hluboko' : ''))).join(', ')
  const zonyVeta = !zonyText ? '' : zakladVeta ? 'příměsi jen do své zóny: ' + zonyText : velke(zonyText)
  const rozvrh = [zakladVeta, zonyVeta].filter(Boolean).join(', ') + (zakladVeta || zonyVeta ? '.' : '')
  const stories: Record<Mode, string> = {
    keep: !removes
      ? 'Při tomto zadání se nic neodváží ani nedováží: příměsi ani písek si nevezmou žádný objem navíc, takže zemina zůstane, jak je.'
      : (calculation.keepM3 > 0
        ? 'Horní část stávající zeminy odvezete (šrafovaná část) a uvolněné místo zaplní to, co dovezete, takže povrch zůstane tam, kde byl. '
        : 'Odvezete celou stávající zeminu z této hloubky (šrafovaná část) a nahradíte ji tím, co dovezete, takže povrch zůstane tam, kde byl. ')
        + rozvrh,
    mix: lifts
      ? 'Nic neodvážíte. ' + rozvrh + ' Objem tím naroste a povrch vystoupí nad okolní terén o výšku kóty.'
      : dovazene.length
        ? 'Nic neodvážíte. ' + rozvrh + ' Objem naroste jen nepatrně, takže se povrch prakticky nezvedne.'
        : 'Nic neodvážíte a při tomto zadání se ani nic nedováží, takže objem zůstává a povrch se nezvedne.',
    new: 'Nejdřív připravíte prostor, tedy vykopete nebo srovnáte podloží do hloubky profilu. '
      + (jediny || zony.length === 0
        ? 'Pak do něj navezete ' + (jediny ? MATERIAL_WORD[jediny].acc : dovoz) + ' až po úroveň terénu.'
        : 'Pak ho zaplníte až po úroveň terénu. ' + rozvrh),
  }
  const notes: Record<Mode, string> = {
    /* Nulové zadání: „Odvezete 0 l" a „zvedne se o 0 cm" si protiřečily
       s komentářem nad sebou, který správně říkal, že se nic neveze. */
    keep: removes
      ? 'Odvezete ' + volume(calculation.removeM3) + ' zeminy; výška terénu zůstává.'
      : 'Neodvážíte nic; výška terénu zůstává.',
    mix: lifts
      ? 'Nic neodvážíte; terén se zvedne o ' + vyskaNavyseni + ' cm.'
      : 'Nic neodvážíte; výška terénu se nemění.',
    /* „Dovezete" je dovoz, ne objem prostoru: při rezervě 30 % se do profilu
       o 30 m³ veze 42,86 m³. Číslo proto bere ze skutečného dovozu, tedy
       z téhož zdroje jako tabulka materiálů. */
    new: 'Vše dovezete: ' + volume(importedM3) + ' ' + (jediny ? MATERIAL_WORD[jediny].gen : 'směsi')
      + (calculation.reserveFactor > 1 ? ' včetně rezervy' : '') + ' do připraveného prostoru.',
  }
  /* Popis pro odečítač se skládá z týchž příznaků jako kresba, jinak tvrdí
     „směs" i tam, kde se nic nedováží a blok „po" je prostá zemina. */
  const poBlok = blended ? 'směs (' + slozkySmesi + ')' : jediny ? MATERIAL_WORD[jediny].nom : 'tatáž zemina'
  const labels: Record<Mode, string> = {
    keep: 'Udržet výšku: před — stávající zemina'
      + (removes ? (calculation.keepM3 > 0 ? ', horní část k odvozu' : ', celá k odvozu') : '')
      + '; po — ' + poBlok + ' do původní výšky terénu.',
    mix: 'Zapravit: před — stávající zemina; po — ' + poBlok
      /* „o 2,2 centimetrů“ je špatně (desetinné číslo chce „centimetru“);
         značku odečítač přečte ve správném tvaru sám. */
      + (lifts ? ' vyšší o ' + vyskaNavyseni + ' cm nad úrovní terénu.' : ' v původní výšce terénu.'),
    new: 'Nová vrstva: před — připravený prázdný prostor; po — ' + poBlok + ' do úrovně terénu.',
  }

  /* Legenda leží UVNITŘ kresby (vzor TriZony). Jen tak je značka v legendě
     pixelově shodná se značkou v řezu při jakémkoli měřítku — jako HTML se
     vzorky rozcházely v rozteči, obrysu i odstínu (9.2 p. 10, úroveň 2). */
  type Znacka = 'drn' | 'soil' | 'sand' | 'space' | 'blend' | 'out' | 'sub'
  /* Značka bloku „po": směs, nebo prostá hmota jediného materiálu. */
  const poZnacka: Znacka = blended ? 'blend' : jediny === 'sand' ? 'sand' : jediny && jediny !== 'soil' ? 'blend' : 'soil'
  /* Drn je v řezu ve všech třech způsobech (vždy aspoň na bloku „po“), proto
     v legendě bez podmínky. Na bloku „před“ u Nové vrstvy chybí záměrně: tam
     je vykopaný prostor, který povrch teprve dostane. */
  const legenda: { znacka: Znacka; popis: string }[] = [
    { znacka: 'drn', popis: 'travní drn' },
    ...(input.mode === 'new'
      ? [{ znacka: 'space' as Znacka, popis: 'připravený prostor' }]
      : [{ znacka: 'soil' as Znacka, popis: 'stávající zemina' }]),
    ...(blended ? [{ znacka: 'blend' as Znacka, popis: 'promíchaná směs' }] : []),
    ...(jediny && !(jediny === 'soil' && input.mode !== 'new')
      ? [{ znacka: poZnacka, popis: jediny === 'soil' ? 'dovezená zemina' : MATERIAL_WORD[jediny].nom }]
      : []),
    ...(removes ? [{ znacka: 'out' as Znacka, popis: 'k odvozu' }] : []),
    { znacka: 'sub', popis: 'podloží' },
  ]
  const LEGENDA_RADEK = 22
  const legendaTop = bottom + PANEL.strip + 38
  const svgBottom = legendaTop + legenda.length * LEGENDA_RADEK

  const tagY = bottom + PANEL.strip + 22
  const arrowY = terrain + depth * scale / 2
  /* Měřítko je společné všem třem způsobům a šířka výřezu je vždy 320, takže
     bloky mají ve všech způsobech stejnou vykreslenou velikost — porovnatelnost
     drží měřítko, ne rám. Výřez si proto každý způsob ořízne shora sám: prázdné
     místo nad terénem potřebuje jen Zapravit, kde se terén zvedá. */
  /* Malé navýšení: popisek kóty by vlevo od ní visel nad blokem „před“ a četl
     se jako jeho popisek (porota 12), proto jde nad drn bloku „po“, jehož
     výšku měří. Nad terénem pak potřebuje víc místa. */
  const malaKota = lifts && rise * scale < 2 * (PANEL.drn + 12)
  const viewTop = Math.max(0, Math.floor(terrain - (lifts ? rise * scale : 0) - (malaKota ? 42 : 30)))

  const mixId = uid + '-blend'
  const outId = uid + '-out'
  /* Drn: zelený pás NAD hmotou, zespodu uzavřený hranou #2e6440 — týž recept
     jako TriZony a TricetCentimetru. `y` je úroveň povrchu, pás leží nad ní.
     Stébla velkých kreseb se sem nevejdou: u Zapravit zbývá nad pásem 1 j.
     rámu, kdežto stéblo měří 13. */
  const drnPas = (x: number, y: number, w: number) => (
    <>
      <rect fill="#3f7d4e" height={PANEL.drn} width={w} x={x} y={y - PANEL.drn} />
      <path d={'M' + x + ' ' + y + ' H' + (x + w)} fill="none" stroke="#2e6440" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </>
  )
  /* Jedna značka = jeden recept, sdílený řezem i legendou. `sDrnem` položí na
     hmotu drn; obrys pak nemá horní hranu (tvar V…H…V), protože tu už nese
     zelená — dvojitý tah by ji ztmavil (DESIGN.md 9.2 p. 9). */
  const znacka = (kind: Znacka, x: number, y: number, w: number, h: number, sDrnem = false) => {
    if (kind === 'drn') {
      /* Ve vzorku legendy je pás stejně silný jako v řezu (9.2 p. 10, úroveň 2),
         jen vycentrovaný ve výšce řádku — včetně svislých konců, kterými pás
         v řezu shora uzavírá hmotu, jinak značka není pixelově shodná. */
      const paty = y + (h + PANEL.drn) / 2
      return (
        <>
          {drnPas(x, paty, w)}
          <path
            d={'M' + x + ' ' + (paty - PANEL.drn) + ' V' + paty + ' M' + (x + w) + ' ' + (paty - PANEL.drn) + ' V' + paty}
            fill="none"
            stroke="#232830"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )
    }
    if (kind === 'space') {
      return <rect fill="none" height={h} stroke="#232830" strokeDasharray="4 5" strokeWidth="1.6" vectorEffect="non-scaling-stroke" width={w} x={x} y={y} />
    }
    if (kind === 'sub') {
      return <g>
        <rect fill="#54402c" height={h} opacity="0.88" width={w} x={x} y={y} />
        <rect fill="none" height={h} stroke="#232830" strokeWidth="1.6" vectorEffect="non-scaling-stroke" width={w} x={x} y={y} />
      </g>
    }
    const obrys = sDrnem
      ? <path d={'M' + x + ' ' + (y - PANEL.drn) + ' V' + (y + h) + ' H' + (x + w) + ' V' + (y - PANEL.drn)} fill="none" stroke="#232830" strokeLinejoin="round" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      : <rect fill="none" height={h} stroke="#232830" strokeWidth="1.6" vectorEffect="non-scaling-stroke" width={w} x={x} y={y} />
    return (
      <g>
        {/* Písek plošně s krytím okrové hmoty Obr. 02 téhož článku (0,55). */}
        <rect
          fill={kind === 'sand' || (kind === 'blend' && smesBezZeminy) ? '#c2a052' : '#6b5138'}
          height={h}
          opacity={kind === 'sand' || (kind === 'blend' && smesBezZeminy) ? 0.55 : 0.9}
          width={w}
          x={x}
          y={y}
        />
        {kind === 'blend' && <rect fill={'url(#' + mixId + ')'} height={h} width={w} x={x} y={y} />}
        {kind === 'out' && <rect fill={'url(#' + outId + ')'} height={h} opacity="0.7" width={w} x={x} y={y} />}
        {sDrnem && drnPas(x, y, w)}
        {obrys}
      </g>
    )
  }

  const popisZnacek = legenda.map((item) => item.popis === 'promíchaná směs'
    ? 'promíchaná směs (' + slozkySmesi + ')'
    : item.popis).join(', ') + '.'

  return (
    <figure className="id-profile-calc__drawing">
      <h3>Jak se profil změní</h3>
      <p className="id-profile-calc__drawing-lead">
        {typography('Stejné zadání — ' + format(input.area) + ' m² a ' + format(depth) + ' cm — ve třech způsobech přípravy. Přepínejte je a sledujte, co se odveze, co se doveze a jak se změní výška terénu. Všechny tři kreslíme ve stejném měřítku, takže jsou porovnatelné; přepínač je týž jako „Co dělám“ v zadání.')}
      </p>
      {/* Přepínač zrcadlí „Co dělám" v zadání — týž stav, jen druhé ovládání.
          Vlastní `name`, jinak by si obě skupiny přepisovaly výběr. */}
      <Choices
        legend="Způsob přípravy"
        name={uid + '-drawing-mode'}
        onChange={onModeChange}
        options={MODE_OPTIONS}
        value={input.mode}
      />
      <div className="id-profile-calc__mode">
        <p className="id-profile-calc__sr" id={uid + '-znacky'}>{typography('Značky v řezu: ' + popisZnacek)}</p>
        <div className="id-profile-calc__mode-canvas">
        <svg
          aria-describedby={uid + '-znacky'}
          aria-label={labels[input.mode]}
          role="img"
          viewBox={'0 ' + viewTop + ' 320 ' + (svgBottom - viewTop)}
        >
          <defs>
            <pattern height="12" id={mixId} patternUnits="userSpaceOnUse" width="12">
              <circle cx="3" cy="3" fill={smesBezZeminy ? '#232830' : '#c2a052'} r="1.5" />
              <circle cx="9" cy="8" fill={smesBezZeminy ? '#232830' : '#c2a052'} r="1.5" />
            </pattern>
            <pattern height="9" id={outId} patternUnits="userSpaceOnUse" width="9">
              <path d="M0 9 9 0" fill="none" stroke="var(--id-cream, #f6f5f2)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </pattern>
          </defs>
          {/* úroveň terénu — společná vztažná linka obou řezů */}
          <line stroke="#d5d3cc" strokeDasharray="3 7" strokeLinecap="round" strokeWidth="1.6" vectorEffect="non-scaling-stroke" x1="8" x2="312" y1={terrain} y2={terrain} />
          {znacka('sub', PANEL.before, bottom, PANEL.width, PANEL.strip)}
          {znacka('sub', PANEL.after, bottom, PANEL.width, PANEL.strip)}

          {/* před */}
          {input.mode === 'new' ? (
            <>
              {znacka('space', PANEL.before, terrain, PANEL.width, depth * scale)}
              {depth * scale >= 34 && <>
                <text className="id-profile-calc__svg-tag" textAnchor="middle" x={PANEL.before + PANEL.width / 2} y={arrowY - 2}>připravený</text>
                <text className="id-profile-calc__svg-tag" textAnchor="middle" x={PANEL.before + PANEL.width / 2} y={arrowY + 13}>prostor</text>
              </>}
            </>
          ) : (
            <>
              {znacka('soil', PANEL.before, terrain, PANEL.width, depth * scale, true)}
              {removes && <>
                <rect fill={'url(#' + outId + ')'} height={removedHeight} opacity="0.7" width={PANEL.width} x={PANEL.before} y={terrain} />
                {/* Popisek nad drnem, ne v něm — pás zabral 9 j. nad terénem. */}
                <text className="id-profile-calc__svg-tag" textAnchor="middle" x={PANEL.before + PANEL.width / 2} y={terrain - PANEL.drn - 8}>odvoz</text>
              </>}
            </>
          )}

          {/* šipka před → po */}
          <path d={'M150 ' + arrowY + ' H167 M162 ' + (arrowY - 5) + ' L168 ' + arrowY + ' L162 ' + (arrowY + 5)} fill="none" stroke="#232830" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />

          {/* po */}
          {znacka(poZnacka, PANEL.after, lifts ? terrain - rise * scale : terrain, PANEL.width, bottom - (lifts ? terrain - rise * scale : terrain), true)}
          {lifts && <>
            <path d={'M166 ' + (terrain - rise * scale) + ' H174 M170 ' + (terrain - rise * scale) + ' V' + terrain + ' M166 ' + terrain + ' H174'} fill="none" stroke="#232830" strokeLinecap="round" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            <text
              className="id-profile-calc__svg-rise"
              textAnchor={malaKota ? 'start' : 'end'}
              x={malaKota ? PANEL.after + 4 : 160}
              y={malaKota ? terrain - rise * scale - PANEL.drn - 6 : (terrain - rise * scale + terrain) / 2 + 6}
            >
              {typography('+' + vyskaNavyseni + ' cm')}
            </text>
          </>}

          <text className="id-profile-calc__svg-tag" textAnchor="middle" x={PANEL.before + PANEL.width / 2} y={tagY}>před</text>
          <text className="id-profile-calc__svg-tag" textAnchor="middle" x={PANEL.after + PANEL.width / 2} y={tagY}>po</text>

          {/* legenda v měřítku kresby */}
          {legenda.map((item, index) => {
            const y = legendaTop + index * LEGENDA_RADEK
            return (
              <g key={item.znacka}>
                {znacka(item.znacka, PANEL.before, y, 16, 16)}
                <text className="id-profile-calc__svg-legend" x={PANEL.before + 24} y={y + 12}>{typography(item.popis)}</text>
              </g>
            )
          })}
        </svg>
        </div>
        <div className="id-profile-calc__mode-text">
          <p className="id-profile-calc__mode-story">{typography(stories[input.mode])}</p>
          <p className="id-profile-calc__mode-outcome">{typography(notes[input.mode])}</p>
        </div>
      </div>
      {/* Popiska nese jednu pointu (9.2 p. 7): co kresba neukazuje. Rekapitulaci
          tří způsobů vypustila porota kola 09 jako třetí výklad téhož mechanismu
          (přepínač i komentář nad ní je mají). */}
      <figcaption>
        Řez záměrně neukazuje složení směsi — to nese výsledek kalkulátoru.
        Výslednou výšku po slehnutí ověřte na místě.
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
  /* Jedna otevřená sekce najednou: obsah se ukazuje vždy na témže místě
     pod řádkem menu, ne pod sebou. Klepnutí na otevřenou ji zase sbalí. */
  const [open, setOpen] = useState<Section | null>(null)
  const pricesPanel = useRef<HTMLDivElement>(null)
  /* Odečítač slyší souhrn až po uživatelově zásahu, ne po načtení stránky. */
  const zasahl = useRef(false)
  const pricesOpen = open === 'prices'
  const toggleSection = (key: Section) => setOpen((previous) => (previous === key ? null : key))

  const input = useMemo<SoilProfileInput>(() => ({
    ...Object.fromEntries(NUMBER_KEYS.map((key) => [key, (key === 'area' || key === 'depth') && raw[key].trim() === '' ? 0 : parseNumber(raw[key])])) as Record<NumberKey, number>,
    mode, soil, currency,
    prices: Object.fromEntries(MATERIALS.map((key) => [key, prices[currency][key].trim() === '' ? 0 : parseNumber(prices[currency][key])])) as SoilProfileInput['prices'],
  }), [raw, mode, soil, currency, prices])
  /* Slider tažení pod zátěží porušovalo INP rozpočet DESIGN.md 6.8 (handler > 50 ms):
     přepočet zón a SVG řezu je drahý. Vizuální pozice palce (--pct) čte `input` přímo
     a zůstává okamžitá; jen tento těžký výstup smí zaostat o snímek za skutečným vstupem. */
  /* Hero panelu ukazuje materiál s největším dovozem, ne natvrdo písek: u
     předvolby Písčitá se písek nepřidává a největší číslo panelu bylo „0 l“. */
  const deferredInput = useDeferredValue(input)
  const calculation = useMemo(() => calculateSoilProfile(deferredInput), [deferredInput])
  const ready = calculation.status === 'ready'
  const hlavniMaterial = MATERIALS.reduce((nej, material) =>
    calculation.delivery[material].m3 > calculation.delivery[nej].m3 ? material : nej, 'sand' as Material)
  const nicSeNeveze = ready && MATERIALS.every((material) => calculation.delivery[material].m3 <= 0)
  const hasEnteredPrices = MATERIALS.some((material) => parseNumber(prices[currency][material]) > 0)
  const issueFor = (field: string) => calculation.issues.find((issue) =>
    issue.field === field && issue.severity === 'error',
  )?.message

  const purchaseAmount = (material: Amendment) => {
    const quantity = calculation.delivery[material]
    return ready ? format(material === 'char' ? quantity.litres : quantity.kg, 1) : '—'
  }

  /* Souhrn pro odečítač začíná tímtéž materiálem jako hero a nulové dovozy
     vynechává; dřív první slyšel „Písek k objednání: 0 l“ (porota 11). */
  const summary = ready
    ? (nicSeNeveze ? 'Při tomto zadání se nic nedováží' : [...MATERIALS]
      .filter((material) => calculation.delivery[material].m3 > 0)
      .sort((a, b) => calculation.delivery[b].m3 - calculation.delivery[a].m3)
      .map((material) => MATERIAL_NAMES[material] + ' k objednání: ' + (material === 'sand' || material === 'soil'
        ? volume(calculation.delivery[material].m3) + ', přibližně ' + mass(calculation.delivery[material].kg)
        : purchaseAmount(material as Amendment) + ' ' + PRICE_UNITS[material]))
      .join('. '))
      + '. Modelová výška profilu ' + format(calculation.finalDepth, 1) + ' cm. '
      + (mode === 'keep' && calculation.removeM3 > 0 ? 'Zemina k odvozu ' + volume(calculation.removeM3) + '. ' : '')
      + (nicSeNeveze ? '' : calculation.hasPrices ? 'Zadané ceny materiálů celkem ' + money(calculation.totalCost, currency) + '.' : 'Ceny zatím nejsou zadané.')
      + (calculation.issues.length ? ' ' + calculation.issues.map((issue) => issue.message).join(' ') : '')
    : calculation.issues.map((issue) => issue.message).join(' ') || 'Zadejte plochu a hloubku.'

  /* Živá oblast patří odpovědi na uživatelův zásah, ne načtení stránky: dřív
     odečítač přečetl 221 znaků souhrnu sám od sebe, zatímco čtenář byl ještě
     u titulku článku (porota 08, přístupnost). První průchod se proto přeskočí. */
  /* Plovoucí lišta překrývá horních ~124 px okna. Prohlížeč prvek, který už
     je uvnitř viewportu, při fokusu neposouvá, takže `scroll-margin-top` na
     ovladače nestačí: Tab na pole pod lištou skončil ze 70 % pod ní. */
  const panelRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    /* Fokus z myši nebo dotyku se nesrovnává: ovladač by ujel zpod kurzoru.
       `:focus-visible` nestačí, textová pole ho mají i po kliknutí, proto
       příznak z `pointerdown`, který spotřebuje nejbližší `focusin`. Klik, který
       fokus nepřenese (druhý klik do pole, dvojklik, klik do textu), by příznak
       nechal nabitý a spolkl by příští fokus z klávesnice (porota 12) — proto ho
       shodí i dokončený klik a jakákoli klávesa. */
    let zUkazatele = false
    let shodit = 0
    const onPointer = () => { zUkazatele = true }
    const onClick = () => {
      window.clearTimeout(shodit)
      shodit = window.setTimeout(() => { zUkazatele = false })
    }
    const onKey = () => { zUkazatele = false }
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      if (zUkazatele) { zUkazatele = false; return }
      if (!target?.matches('input, button, select, textarea, [tabindex]')) return
      /* Rádio je skryté 1 × 1 px v rohu pilulky; měří se viditelná pilulka,
         jinak pilulka zasahující do kapsle jen pravou částí zůstala pod ní. */
      const viditelny = target.matches('input[type="radio"]') && target.nextElementSibling instanceof HTMLElement
        ? target.nextElementSibling
        : target
      const rect = viditelny.getBoundingClientRect()
      /* Zakrytá zóna podle skutečné kapsle, jen tam, kde se s ní prvek kryje
         i vodorovně; bez kapsle záloha podle tokenu. */
      const kapsle = document.querySelector('.id-capsule')?.getBoundingClientRect()
      const offset = kapsle
        ? (rect.right > kapsle.left && rect.left < kapsle.right ? kapsle.bottom : 0)
        : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--id-anchor-offset')) || 124
      const chybi = offset + 12 - rect.top
      if (!offset || chybi <= 0) return
      window.scrollBy({
        top: -chybi,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    }
    panel.addEventListener('pointerdown', onPointer)
    panel.addEventListener('click', onClick)
    panel.addEventListener('focusin', onFocus)
    document.addEventListener('keydown', onKey, true)
    return () => {
      window.clearTimeout(shodit)
      panel.removeEventListener('pointerdown', onPointer)
      panel.removeEventListener('click', onClick)
      panel.removeEventListener('focusin', onFocus)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [])

  useEffect(() => {
    if (!zasahl.current) return
    const timer = window.setTimeout(() => setAnnouncement(summary), 400)
    return () => window.clearTimeout(timer)
  }, [summary])

  const updateNumber = (key: NumberKey, value: string) => {
    zasahl.current = true
    setRaw((previous) => ({ ...previous, [key]: value }))
    if (['ratio', 'biovin', 'char', 'zeolit'].includes(key)) setSoil('vlastni')
  }
  const changeSoil = (nextSoil: Soil) => {
    zasahl.current = true
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
    setOpen('prices')
    window.requestAnimationFrame(() => pricesPanel.current?.querySelector<HTMLInputElement>('input[type="text"]')?.focus())
  }
  const field = (key: NumberKey, label: string, unit: string, hint?: string, prominent = false, context?: string, idKey?: string) => (
    <NumberField
      context={context}
      error={issueFor(key)}
      hint={hint}
      id={uid + '-' + (idKey ?? key)}
      key={idKey ?? key}
      label={label}
      onChange={(value) => updateNumber(key, value)}
      prominent={prominent}
      unit={unit}
      value={raw[key]}
    />
  )

  /* `output[for]` je podle HTML seznam IDREFs v témže stromu. Rezerva
     a hustoty se montují až s otevřenou sekcí Podrobnosti, proto se ze
     seznamu zdrojů při zavřené sekci vypouštějí; jinak osm odkazů míří
     do prázdna. Skrývat pole místo odmontování by bylo horší: skrytá
     pole zůstanou mimo strom přístupnosti a šest řízených vstupů by se
     překreslovalo při každém úhozu. */
  const sourceIds = (keys: string[]) =>
    keys.filter((key) => open === 'details' || !DETAIL_KEYS.includes(key)).map((key) => uid + '-' + key).join(' ')

  const purchaseQuantity = (material: Amendment) => (
    <div className="id-profile-calc__purchase">
      <label htmlFor={uid + '-purchase-' + material}>K objednání</label>
      <output
        aria-label={'K objednání — ' + MATERIAL_NAMES[material]}
        aria-live="off"
        className="id-profile-calc__purchasevalue"
        htmlFor={sourceIds(['area', 'depth', 'ratio', material, material + 'Depth', 'loss', material === 'biovin' ? 'rhoB' : material === 'zeolit' ? 'rhoZe' : 'rhoC'])}
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
      ref={panelRef}
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
                onChange={(next) => { zasahl.current = true; setMode(next) }}
                options={MODE_OPTIONS}
                value={mode}
              />
              <HintStack className="id-profile-calc__modehint" options={MODE_HINTS} value={mode} />
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
              <HintStack className="id-profile-calc__hint" options={SOIL_HINTS} value={soil} />
              <p className="id-profile-calc__hint">
                Předvolby nastaví dolní hranice rozsahů příměsí. Úpravou poměru nebo příměsí přejdete na vlastní recepturu.
              </p>

              <div className="id-profile-calc__ratio">
                <label htmlFor={uid + '-ratio'}>{typography('Poměr písek : zemina')}</label>
                <output aria-live="off" htmlFor={uid + '-ratio'}>
                  {typography(format(input.ratio, 0) + ' : ' + format(100 - input.ratio, 0))}
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
                {typography('Podíl příměsi počítáme z objemu půdy od povrchu do zadané hloubky a každou z nich můžete zapravit jinak hluboko. Podíl písku platí z minerálního základu, tedy z objemu, který po příměsích zbyde, a sahá do hloubky celého profilu.')}
              </p>
              <div className="id-profile-calc__additionlist">
                <fieldset className="id-profile-calc__amendment">
                  <legend>Písek</legend>
                  <div className="id-profile-calc__additiongrid">
                    {field('ratio', 'Podíl', '%', undefined, false, 'Písek', 'sand-podil')}
                    {/* Hloubka písku je táž veličina jako hloubka profilu, takže je tu
                        jen odečtem. Dřív to bylo druhé editovatelné pole se stejným
                        popiskem, jen menší, a zápis do něj tiše přepsal celý model. */}
                    <div className="id-profile-calc__field id-profile-calc__readout">
                      <span>{mode === 'mix' ? 'Původní hloubka' : 'Hloubka profilu'}</span>
                      {/* Odečet sází tentýž recept jako „K objednání“ vedle (číslo v akcentu,
                          jednotka menší), aby řádek Písek četl jako jeden celek. */}
                      <p className="id-profile-calc__purchasevalue">
                        <strong>{format(input.depth)}</strong>
                        <span>cm</span>
                      </p>
                    </div>
                    <div className="id-profile-calc__purchase">
                      <label htmlFor={uid + '-sand-amount'}>K objednání</label>
                      <output
                        aria-label="K objednání — Písek"
                        aria-live="off"
                        className="id-profile-calc__purchasevalue"
                        htmlFor={sourceIds(['area', 'depth', 'ratio', 'loss', 'rhoS'])}
                        id={uid + '-sand-amount'}
                      >
                        <strong>{ready ? format(calculation.delivery.sand.tonnes) : '—'}</strong>
                        <span> t</span>
                      </output>
                    </div>
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
                {input.loss > 0 && !nicSeNeveze && typography(' Množství k objednání zahrnuje rezervu ' + format(input.loss) + ' %.')}
              </p>
            </fieldset>
          </AlignedInputColumns>
        </div>

        <div aria-label="Výsledek a nastavení výpočtu" className="id-profile-calc__menu" role="group">
          {([
            /* Hint neopakuje veličinu, kterou zadání ukazuje o kus výš v objednací
               jednotce („Písek k objednání 28,52 t"); táž veličina ve dvou jednotkách
               na jedné obrazovce mate. Říká, co je uvnitř, jako zbylá dvě tlačítka. */
            { key: 'results', title: 'Výsledek', hint: ready ? 'rozpis k objednání' : 'zatím nespočítáno' },
            { key: 'prices', title: 'Ceny materiálů', hint: hasEnteredPrices ? SYMBOLS[currency] : 'zatím nezadané' },
            { key: 'details', title: 'Podrobnosti o směsi', hint: 'rezerva a hustoty' },
            { key: 'help', title: 'Jak výpočet číst' },
          ] as { key: Section; title: string; hint?: string }[]).map((item) => (
            <button
              aria-controls={open === item.key ? uid + '-panel-' + item.key : undefined}
              aria-expanded={open === item.key}
              className={cn('id-profile-calc__menuitem', open === item.key && 'is-open')}
              id={uid + '-menu-' + item.key}
              key={item.key}
              onClick={() => toggleSection(item.key)}
              type="button"
            >
              <span className="id-profile-calc__menutitle">{typography(item.title)}</span>
              {item.hint && <span className="id-profile-calc__menuhint">{typography(item.hint)}</span>}
            </button>
          ))}
        </div>

        {open === 'results' && (
          <div aria-labelledby={uid + '-menu-results'} className="id-profile-calc__results" id={uid + '-panel-results'} role="region">
          <div className="id-profile-calc__primary">
              <span>{typography(nicSeNeveze ? 'K objednání' : MATERIAL_NAMES[hlavniMaterial] + ' k objednání')}</span>
              <strong>{ready ? nicSeNeveze ? 'nic' : typography(volume(calculation.delivery[hlavniMaterial].m3)) : '—'}</strong>
              <p>{ready ? nicSeNeveze ? 'Při tomto zadání se nic nedováží.' : typography('≈ ' + mass(calculation.delivery[hlavniMaterial].kg)) : calculation.status === 'invalid' ? 'Opravte označené údaje.' : 'Doplňte plochu a hloubku.'}</p>
          </div>
          {/* Nulový dovoz: tabulka pěti nul, „odvoz 0 l“ a výzva k cenám říkaly
              totéž co jedno „nic“ v heru, na telefonu na 800 px (porota 12). */}
          {!nicSeNeveze && <MaterialTable calculation={calculation} currency={currency} ready={ready} showPrices={hasEnteredPrices || pricesOpen} />}
          <dl className="id-profile-calc__totals">
            {mode === 'keep' && !nicSeNeveze && <>
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
              {/* Táž přesnost a týž zápis jako kóta v kresbě (porota 12). */}
              <div><dt>Zvýšení terénu</dt><dd>{ready ? typography(format(calculation.rise, 1) === '0' ? '0 cm' : '+' + format(calculation.rise, 1) + ' cm') : '—'}</dd></div>
            </>}
            <div><dt>Modelová výška</dt><dd>{ready ? typography(format(calculation.finalDepth, 1) + ' cm') : '—'}
              <small>{ready ? typography(volume(calculation.finalVolume) + ' surovin pro profil') : '—'}</small>
            </dd></div>
            {!nicSeNeveze && <div className={cn('id-profile-calc__cost', ready && calculation.hasPrices && 'id-profile-calc__cost--set')}>
              <dt>{!ready || calculation.missingPrices.length ? 'Součet zadaných cen' : 'Materiál celkem'}</dt>
              <dd>{ready ? calculation.hasPrices ? typography(money(calculation.totalCost, currency)) : 'Ceny nezadané' : '—'}</dd>
            </div>}
          </dl>
          {!nicSeNeveze && <button className="id-profile-calc__textbutton" onClick={openPrices} type="button">
            {hasEnteredPrices ? 'Upravit ceny materiálů' : 'Zadat ceny materiálů'} <span aria-hidden="true">↓</span>
          </button>}
          {ready && !nicSeNeveze && <>
            <p className="id-profile-calc__hint">
              {typography(calculation.hasPrices
                ? 'Bez dopravy a odvozu. ' + (calculation.missingPrices.length
                  ? 'Neoceněné materiály: ' + calculation.missingPrices.map((key) => MATERIAL_NAMES[key]).join(', ') + '.'
                  : 'Cena zahrnuje všechny dovážené materiály.')
                : 'Množství platí i bez cen. Nulová cena se do součtu nezahrnuje.')}
            </p>
            {input.loss > 0 && <p className="id-profile-calc__hint">
              {typography('Objednávka obsahuje rezervu ' + format(input.loss) + ' %. Rezerva navyšuje jen dovážený materiál.')}
            </p>}
            {calculation.delivery.sand.kg > 0 && <p className="id-profile-calc__transport">
              {typography('Dovoz písku: ' + sandDeliveryOptions(calculation).join(', nebo ') + '.')}
            </p>}

          </>}
          {calculation.issues.length > 0 && (
            <ul className="id-profile-calc__issues">
              {calculation.issues.map((issue, index) => <li key={issue.code + '-' + index}>{typography(issue.message)}</li>)}
            </ul>
          )}
          {ready && calculation.issues.length === 0 && (
            /* Bez vlastní živé oblasti: změnu už ohlásí souhrn, odečítač
               jinak slyšel tutéž zprávu dvakrát za sebou (porota 12). */
            <div className="id-verdict id-verdict--ok">
              <Ok />
              <span>{typography(nicSeNeveze
                ? 'Zadání je konzistentní.'
                : 'Zadání je konzistentní. Materiály jsou připravené k objednání.')}</span>
            </div>
          )}
          </div>
        )}

        {open === 'prices' && (
          <div aria-labelledby={uid + '-menu-prices'} className="id-profile-calc__detailsbody" id={uid + '-panel-prices'} ref={pricesPanel} role="region">
            <Choices
              legend="Měna"
              name={uid + '-currency'}
              onChange={(next) => { zasahl.current = true; setCurrency(next) }}
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
                onChange={(value) => { zasahl.current = true; setPrices((previous) => ({
                  ...previous,
                  [currency]: { ...previous[currency], [material]: value },
                })) }}
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
        )}

        {open === 'details' && (
          <div aria-labelledby={uid + '-menu-details'} className="id-profile-calc__detailsbody" id={uid + '-panel-details'} role="region">
            <div className="id-profile-calc__detailgrid">
              {DETAIL_FIELDS.map(([key, label, unit, hint]) => field(key, label, unit, hint))}
            </div>
          </div>
        )}

        {open === 'help' && (
          <div aria-labelledby={uid + '-menu-help'} className="id-profile-calc__help" id={uid + '-panel-help'} role="region">
            <p><strong>Objem je základ.</strong> {typography('Plocha v m² × hloubka v cm ÷ 100 dává objem vrstvy v m³. Procenta příměsí se počítají z objemu příslušné zóny. Poměr písek : zemina se uplatní až na zbývající minerální základ.')}</p>
            {/* Běžný text panelu prochází českou sazbou jako zbytek kalkulátoru;
                dřív na konci řádků visela „a“, „v“ i „V“ (porota 11 a 12). */}
            <p><strong>Udržet výšku:</strong> {typography('odváží se část původní zeminy, kterou nahradí nové složky.')}
              <strong> Zapravit:</strong> {typography('zemina zůstává a dovoz zvyšuje objem i výšku profilu.')}
              <strong> Nová vrstva:</strong> {typography('nakupují se všechny složky včetně zeminy.')}</p>
            <p><strong>Hustota mění hmotnost, nikoli poměr.</strong> {typography('Litr materiálu vynásobený sypnou hustotou v kg/l dává kilogramy. Pro objednávku hmotnost ověřte u dodavatele.')}</p>
            <p><strong>Každá příměs má vlastní hloubku.</strong> {typography('Nastavíte ji vedle jejího podílu, vždy od povrchu. Pokud je profil mělčí, započítáme příměs jen do skutečné hloubky profilu. V režimu Zapravit se hloubka měří od nového povrchu.')}</p>
            <p><strong>Rezerva patří k objednávce.</strong> {typography('Zeminu ponechanou na místě nezvětšuje. Receptura a řez zůstávají v čistých objemech; slehnutí a výslednou výšku ověřte při realizaci.')}</p>
            <p>{typography('Předvolby jsou výchozí modelové receptury. Vhodnost písku, příměsí a konkrétního poměru závisí na půdě, podloží a vlastnostech dodaných materiálů. Před úpravou celé plochy ověřte směs na menším vzorku.')}</p>
          </div>
        )}
      </div>

      <ProfileDrawing calculation={calculation} input={input} onModeChange={(next) => { zasahl.current = true; setMode(next) }} uid={uid} />
      <p aria-atomic="true" aria-live="polite" className="id-profile-calc__sr" role="status">
        {typography(announcement)}
      </p>
    </section>
  )
}
