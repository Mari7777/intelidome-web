import React from 'react'

import { calculateSoilProfile, INPUT_DEFAULTS, SOIL_PRESETS } from '@/blocks/Calculator/soilProfileMath'

/**
 * Podíl z vlastní hloubky (DESIGN.md 9.2) — tatáž 2 % zeolitu na ploše
 * 100 m² ve dvou řezech profilem 30 cm (8 px na cm jako `kontrola-sondou`
 * a `tri-zony`). Vlevo leží zeolit jen v 0–15 cm: podíl se počítá z 15 m³
 * jeho zóny, ne z celých 30 m³ profilu. Pravý řez je jen srovnání „kdyby"
 * (tatáž procenta do 30 cm = dvojnásobek), žádné doporučení — pointa
 * (300 l, 24 px) má jako jediná vlastní řádek; srovnání vpravo je jeden
 * řádek `.sv-val`, takže ho mobilní sazba (18/21) nevytáhne nad pointu.
 * Dole legenda zeolitu a pomůcka: deska 1 cm v měřítku řezu = 10 l na m².
 * Čísla kresba počítá z `calculateSoilProfile` + `SOIL_PRESETS`, změna
 * výpočtu se do ní propíše sama.
 *
 * Vzor zeolitu je pixelově shodný s `mh-zeolit`. Vlevo se spodní hrana
 * vytrácí jako `mh-mask` (hranice uvnitř půdy); vpravo zóna sahá až na dno,
 * a tak je vzor plný bez masky jako `ks-ridka` („Až na dno") a končí
 * v poslední mezeře řad nad dnem. Počátek vzoru (78, 57) klade povrch i
 * boky obou řezů (x 80/232 a 318/470, rozestup 238 = 7 dlaždic) do mezer
 * mezi zrny s vůlí ~1,4 k obrysu; stupnice visí vlevo jako ve vzorech.
 *
 * Portrétová sazba 520 px, id s prefixem `pv-`. Řádek srovnání „30 m³ × 2 %
 * = 600 l" má 19 znaků, ale v sazbě 21 jednotek končí na x ~494 (≤ 520);
 * ostatní popisky ≤ 14 znaků. Statická kresba.
 */

const PLOCHA = 100 // m²
const PROFIL = 30 // cm
const PODIL = SOIL_PRESETS.jil.zeolit // 2 %

const T = 60 // povrch, 0 cm
const CM = 8
const B = T + PROFIL * CM // dno profilu, 300
const W = 152
const LX = 80 // řez „do 15 cm"
const RX = 318 // řez „kdyby do 30 cm"
const yCm = (cm: number) => T + cm * CM

/** Vzor zeolitu: dlaždice 34 × 26 s počátkem (78, 57). Volný pás bez zrn je
 *  lokálně y 0–5,2 — povrch (60) i konec plné zóny leží lokálně na 3. */
const VZOR_Y = 57
const DLAZDICE = 26
const KONEC_PLNE = VZOR_Y + Math.floor((B - VZOR_Y) / DLAZDICE) * DLAZDICE + 3 // 294

/** Zeolit zapravený do `hloubka` cm: objem jeho zóny a dovoz v litrech. */
const zeolit = (hloubka: number) => {
  const r = calculateSoilProfile({
    ...INPUT_DEFAULTS, mode: 'keep', area: PLOCHA, depth: PROFIL,
    zeolit: PODIL, zeolitDepth: hloubka, loss: 0,
  })
  return {
    zonaM3: (PLOCHA * r.incorporationDepths.zeolit) / 100,
    litry: Math.round(r.delivery.zeolit.litres),
  }
}
const VLEVO = zeolit(15) // 15 m³ → 300 l
const VPRAVO = zeolit(30) // 30 m³ → 600 l

const cislo = (n: number) => String(n).replace('.', ',')

/** Zeolitové zrno — týž tvar jako v patternu `mh-zeolit` (9.2 p. 10). */
const Zrno: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path d={`M${x} ${y} l5 -2 4 3 -1 5 -5 2 -4 -3 z`} fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
)

const REZY = [LX, RX] as const

export const PodilZVlastniHloubky: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 440">
    <defs>
      {/* Pixelově shodné s `mh-zeolit`; jen posunutý počátek dlaždice. */}
      <pattern id="pv-zeolit" x="78" y={VZOR_Y} width="34" height={DLAZDICE} patternUnits="userSpaceOnUse">
        <path d="M6 8 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
        <path d="M23 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      </pattern>
      {/* Kopie `mh-fade` + `mh-mask`: plně do 75 %, pak k nule. */}
      <linearGradient id="pv-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="pv-mask" maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill="url(#pv-fade)" />
      </mask>
    </defs>

    <text className="sv-lbl" x={LX} y="34">{`Stejná ${cislo(PODIL)} % zeolitu · plocha ${PLOCHA} m²`}</text>

    {/* ── společná stupnice ───────────────────────────────────── */}
    <line x1="62" y1={T} x2="62" y2={B} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      {[0, 15, 30].map((h) => <line key={h} x1="56" y1={yCm(h)} x2="68" y2={yCm(h)} />)}
    </g>
    <text className="sv-val" x="50" y={yCm(0) + 5} textAnchor="end">0 cm</text>
    <text className="sv-val" x="50" y={yCm(15) + 5} textAnchor="end">15</text>
    <text className="sv-val" x="50" y={yCm(30) + 5} textAnchor="end">30</text>

    {/* ── řezy ────────────────────────────────────────────────── */}
    {REZY.map((x0) => (
      <rect key={x0} x={x0} y={T} width={W} height={B - T} fill="#6b5138" opacity="0.9" />
    ))}
    {/* hloubka 15 cm přes celou kresbu — pod zrny, v pravém řezu prosvítá mezi nimi */}
    <line x1="68" y1={yCm(15)} x2={RX + W} y2={yCm(15)} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    {/* vlevo 0–15 cm: hranice uvnitř půdy se vytrácí (15 cm + 6 jako `mh-mask`) */}
    <rect x={LX} y={T} width={W} height={15 * CM + 6} fill="url(#pv-zeolit)" mask="url(#pv-mask)" />
    {/* vpravo až na dno: plný vzor bez masky, poslední řada zrn celá */}
    <rect x={RX} y={T} width={W} height={KONEC_PLNE - T} fill="url(#pv-zeolit)" />
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round">
      {REZY.map((x0) => <path key={x0} d={`M${x0} ${T} H${x0 + W} V${B} H${x0} Z`} />)}
    </g>

    {/* ── výpočet pod řezy ────────────────────────────────────── */}
    <text className="sv-lbl" x={LX} y={B + 24}>do 15 cm</text>
    <text className="sv-val" x={LX} y={B + 51}>{`${cislo(VLEVO.zonaM3)} m³ × ${cislo(PODIL)} %`}</text>
    {/* Pointa kresby (9.2 p. 3) je jedna a jako jediná má vlastní řádek. */}
    <text className="sv-val" x={LX} y={B + 81} style={{ fontSize: 24 }}>{`${VLEVO.litry} l`}</text>

    {/* Srovnání „kdyby" — jeden řádek hodnoty, žádné samostatné číslo. */}
    <text className="sv-lbl" x={RX} y={B + 24}>kdyby do 30 cm</text>
    <text className="sv-val" x={RX} y={B + 51}>{`${cislo(VPRAVO.zonaM3)} m³ × ${cislo(PODIL)} % = ${VPRAVO.litry} l`}</text>

    {/* ── legenda, pak pomůcka (9.2 p. 10) ────────────────────── */}
    <line x1="30" y1="395" x2="490" y2="395" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <Zrno x={32} y={418} />
    <text className="sv-val" x="52" y="424">zeolit</text>
    {/* deska 1 cm v měřítku řezů */}
    <rect x="150" y="415" width="80" height={CM} fill="#6b5138" fillOpacity="0.9" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="242" y="424">1 m² × 1 cm = 10 l</text>
  </svg>
)
