'use client'

import React, { useId, useState } from 'react'

import { cn } from '@/utilities/ui'

export type CalculatorBlockProps = {
  kind: 'prutok' | 'davka'
  light?: boolean | null
  id?: string | null
  blockName?: string | null
  blockType?: 'calculator'
  className?: string
}

/** Česky: desetinná čárka, tabulkové číslice řeší CSS. */
const fmt = (value: number, decimals = 1): string =>
  Number.isFinite(value)
    ? value.toFixed(decimals).replace(/\.0$/, '').replace('.', ',')
    : '—'

const Ok = () => (
  <span className="ic">
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  </span>
)

const Warn = () => (
  <span className="ic">
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="M6 2.6v4" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
      <circle cx="6" cy="9" fill="#fff" r="1.1" />
    </svg>
  </span>
)

/**
 * Kalkulátorový panel (DESIGN.md 7.7).
 *
 * Počítá při psaní — žádné tlačítko „spočítat". Hodnoty jsou předvyplněné
 * čísly z článku, takže panel něco ukazuje hned a čtenář jen přepíše svoje.
 * Verdikt má `aria-live="polite"`, aby se odečítač dozvěděl výsledek.
 */
export const CalculatorBlock: React.FC<CalculatorBlockProps> = ({ className, kind, light }) => {
  const uid = useId()
  const panel = cn('id-calc not-prose', light && 'id-calc--light', !light && className)
  const telo = kind === 'prutok' ? <Prutok className={panel} uid={uid} /> : <Davka className={panel} uid={uid} />

  /*
    Světlý kalkulátor stojí v krémovém mezipásu (8.1 p. 5–6): panel na
    krému je jeho vlastní varianta dle 7.7 a pás zároveň rozetne dlouhý
    bílý běh, který porota měřila na 65 % výšky stránky.
  */
  if (!light) return telo

  return (
    <section className={cn('rv id-band id-band--cream id-band--sm', className)}>
      <div className="id-band__inner id-band__inner--summary">{telo}</div>
    </section>
  )
}

/** Kbelíkový test: objem a čas → průtok, mínus 20 % rezervy, verdikt proti 25 l/min. */
const Prutok = ({ className, uid }: { className: string; uid: string }) => {
  const [objem, setObjem] = useState(10)
  const [cas, setCas] = useState(24)

  const platne = objem > 0 && cas > 0
  const namereny = platne ? (objem / cas) * 60 : NaN
  const navrhovy = namereny * 0.8
  const staci = navrhovy >= 25

  return (
    <div className={className}>
      <div className="id-calc__head">
        <h3>Vyhodnoťte svůj kbelíkový test</h3>
        <span className="id-chip--outline-accent">Kalkulátor</span>
      </div>

      <div>
        <div className="id-calc__field">
          <label htmlFor={`${uid}-objem`}>Objem nádoby</label>
          <div className="id-calc__inrow">
            <input
              id={`${uid}-objem`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setObjem(Number(e.target.value))}
              step="0.5"
              type="number"
              value={objem}
            />
            <span className="unit">litrů</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-cas`}>Čas naplnění</label>
          <div className="id-calc__inrow">
            <input
              id={`${uid}-cas`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setCas(Number(e.target.value))}
              step="1"
              type="number"
              value={cas}
            />
            <span className="unit">sekund</span>
          </div>
        </div>
      </div>

      <div>
        <div className="id-calc__orow">
          <span className="id-calc__ol">Naměřený průtok</span>
          <span className="id-calc__ov">{platne ? `${fmt(namereny)} l/min` : '—'}</span>
        </div>
        <div className="id-calc__orow id-calc__orow--hero">
          <span className="id-calc__ol">Návrhový průtok po odečtení 20 %</span>
          <span className="id-calc__ov">{platne ? `${fmt(navrhovy)} l/min` : '—'}</span>
        </div>

        <div
          aria-live="polite"
          className={cn('id-verdict', staci && platne ? 'id-verdict--ok' : 'id-verdict--warn')}
        >
          {staci && platne ? <Ok /> : <Warn />}
          <span>
            {!platne
              ? 'Doplňte objem nádoby a čas, za který se naplnila.'
              : staci
                ? `Zdroj na běžný systém stačí — návrhový průtok ${fmt(navrhovy)} l/min je nad hranicí 25 l/min.`
                : `Na běžný systém to zatím nestačí: ${fmt(navrhovy)} l/min proti potřebným 25 l/min. Rozdělte zahradu na víc sektorů, nebo posilte zdroj.`}
          </span>
        </div>
      </div>
    </div>
  )
}

/** Plocha a dávka → objem jedné zálivky a doba běhu při známém průtoku. */
const Davka = ({ className, uid }: { className: string; uid: string }) => {
  const [plocha, setPlocha] = useState(60)
  const [davka, setDavka] = useState(12)
  const [prutok, setPrutok] = useState(20)

  const platne = plocha > 0 && davka > 0 && prutok > 0
  const litry = plocha * davka
  const minuty = litry / prutok
  const dlouhe = minuty > 45

  return (
    <div className={className}>
      <div className="id-calc__head">
        <h3>Kolik vody a jak dlouho</h3>
        <span className="id-chip--outline-accent">Kalkulátor</span>
      </div>

      <div>
        <div className="id-calc__field">
          <label htmlFor={`${uid}-plocha`}>Plocha sektoru</label>
          <div className="id-calc__inrow">
            <input
              id={`${uid}-plocha`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPlocha(Number(e.target.value))}
              step="10"
              type="number"
              value={plocha}
            />
            <span className="unit">m²</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-davka`}>Dávka na zálivku</label>
          <div className="id-calc__inrow">
            <input
              id={`${uid}-davka`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setDavka(Number(e.target.value))}
              step="1"
              type="number"
              value={davka}
            />
            <span className="unit">l/m²</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-prutok`}>Návrhový průtok</label>
          <div className="id-calc__inrow">
            <input
              id={`${uid}-prutok`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPrutok(Number(e.target.value))}
              step="1"
              type="number"
              value={prutok}
            />
            <span className="unit">l/min</span>
          </div>
        </div>
      </div>

      <div>
        <div className="id-calc__orow">
          <span className="id-calc__ol">Objem jedné zálivky</span>
          <span className="id-calc__ov">{platne ? `${fmt(litry, 0)} l` : '—'}</span>
        </div>
        <div className="id-calc__orow id-calc__orow--hero">
          <span className="id-calc__ol">Doba běhu jedním sektorem</span>
          <span className="id-calc__ov">{platne ? `${fmt(minuty, 0)} min` : '—'}</span>
        </div>

        <div
          aria-live="polite"
          className={cn('id-verdict', platne && !dlouhe ? 'id-verdict--ok' : 'id-verdict--warn')}
        >
          {platne && !dlouhe ? <Ok /> : <Warn />}
          <span>
            {!platne
              ? 'Doplňte plochu, dávku a průtok.'
              : dlouhe
                ? `${fmt(minuty, 0)} minut v jednom kuse je moc — voda odteče dřív, než se stihne vsáknout. Rozdělte plochu na víc sektorů a nechte mezi nimi vsáknout.`
                : `${fmt(minuty, 0)} minut na sektor je rozumná dávka — voda stihne vsáknout, místo aby odtekla po povrchu.`}
          </span>
        </div>
      </div>
    </div>
  )
}
