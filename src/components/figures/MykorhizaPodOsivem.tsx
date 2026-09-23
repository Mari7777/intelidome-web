import React from 'react'

/**
 * Mykorhiza pod osivem (DESIGN.md 9.2) — stejná dávka, jiné místo. Dva úzké
 * řezy 0–30 cm vedle sebe (8 px na cm jako `prvni-korinek` a `tri-zony`),
 * společná stupnice vlevo. Vlevo leží přípravek v pásu 2–4 cm, tedy ≈ 3 cm
 * pod osivem. Mladé kořínky sahají jen ≈ 3,5 cm, stejně jako v kresbě
 * prvního kořínku, a v pásu se ho dotknou hned. Vpravo je týž počet značek
 * (12) rozptýlený po vrstvách 20 px do celých 30 cm. Tytéž kořínky potkají
 * jen tu nejmělčí, zbytek dávky je mimo jejich dosah. Jediný akcent je modrý
 * bod v místě kontaktu kořínku s přípravkem; v legendě má vlastní klíč,
 * aby se nečetl jako voda z `prvni-korinek`.
 *
 * Značka přípravku = výsek vlákna houby z `mykorhizni-vlakna` v polovičním
 * měřítku (týž oblouk, #d8c9b4 op .5), vodorovný, aby se od šikmo padajících
 * kořínků lišil směrem. Boční odbočky kořínků končí nad pásem (≤ 12 px) a
 * značky pásu drží od kořínků odstup ≥ 6 px, kromě tří v bodech kontaktu.
 * Na krémovém podkladu by vlákno nebylo vidět, proto v legendě leží na
 * výřezu řezu se stejným obrysem jako řez (ne na barevném políčku zeminy).
 * Horní hranu nenese drn (čerstvé seťové lůžko), obrys je proto uzavřený
 * (9.2 p. 9) a semena na něm jen leží.
 *
 * Portrétová sazba 520 px, id s prefixem `mp-`. Popisky mají rezervu na
 * telefonní 18/21 jednotek: klíčová hodnota s kótou 0–3 cm stojí u pravé
 * hrany levého řezu, pravý sloupec má ≤ 11 znaků popisku. Statická kresba.
 */

const T = 60 // povrch seťového lůžka
const HLOUBKA = 240 // 30 cm × 8 px
const B = T + HLOUBKA
const SIRKA = 150
const LX = 80 // řez „pod osivo"
const RX = 346 // řez „rozptýleno do 30 cm"
const cm = (h: number) => T + h * 8

/** Semena: x v řezu a mírné natočení. */
const SEMENA: Array<[number, number]> = [
  [26, -12],
  [75, 8],
  [124, -4],
]

/** Mladé kořínky, lokálně od semene (0 0 = povrch). Hlavní kořínek končí
 *  v 27–30 px (≈ 3,5 cm, jako `prvni-korinek`), odbočky končí nad pásem. */
const KORINKY = [
  'M0 0 C -1 9, 1 19, 0 29 M0 6 q-3 1 -5 5',
  'M0 0 C 1 8, -1 17, 0 27 M0 5 q3 1 5 5',
  'M0 0 C -1 9, 1 20, 0 30 M0 7 q3 1 5 5',
]

/** Přípravek v levém řezu: pás 2–4 cm, dvě řady po šesti značkách.
 *  [x začátku v řezu, y začátku od povrchu]; značka stoupá o 3 px doprava,
 *  řada A tedy leží v 17–20 px, řada B v 28–31 px. */
const PAS: Array<[number, number]> = [
  [5, 20], [32.5, 20], [53.5, 20], [75, 20], [103, 20], [130, 20],
  [11, 31], [32, 31], [53, 31], [82, 31], [109, 31], [130, 31],
]
/** Tři kontakty v pásu: konec značky na kořínku (2,5 a 3,5 cm). */
const PAS_KONTAKTY: Array<[number, number]> = [[26, 28], [75, 20], [124, 28]]

/** Tatáž dávka rozptýlená do 30 cm: 12 značek po vrstvách 20 px (střed
 *  10, 30 … 230 ± 4). Kořínků se dotkne jen první; druhá leží pod
 *  hroty kořínků mezi nimi, zbytek je mimo dosah. */
const ROZPTYL: Array<[number, number]> = [
  [26, 11], [92, 34], [10, 52], [118, 68], [58, 93], [20, 108],
  [100, 132], [44, 148], [124, 173], [8, 190], [78, 212], [30, 228],
]
const ROZPTYL_KONTAKTY: Array<[number, number]> = [[26, 11]]

/** Značka přípravku: vlákno houby z `mykorhizni-vlakna` v měřítku 1 : 2. */
const Vlakno: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M${x} ${y} c 5 -2, 10 -1, 15 -3`}
    fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"
  />
)

/** Značka semene: obrysový ovál bez výplně. */
const Seme: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <ellipse cx={x} cy={y} rx="5.5" ry="3.4" transform={`rotate(${r} ${x} ${y})`} fill="none" stroke="#232830" strokeWidth="1.6" />
)

/** Aktivní bod: kořínek se potkal s přípravkem. */
const Kontakt: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <circle cx={x} cy={y} r="3.4" fill="#2563eb" />
)

/** Kořínek (tah shodný pro řez i legendu). */
const koren = { fill: 'none', stroke: '#d8c9b4', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.9 } as const

/** Výřez řezu pro legendu: táž zemina a týž obrys jako řez. */
const Vyrez: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <rect x={x} y={y} width="26" height="16" fill="#6b5138" fillOpacity="0.9" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
)

/** Jeden řez: ornice, přípravek, semena s kořínky, uzavřený obrys. */
const Rez: React.FC<{ x0: number; id: string; znacky: Array<[number, number]>; kontakty: Array<[number, number]> }> = ({ x0, id, znacky, kontakty }) => (
  <g>
    <g clipPath={`url(#${id})`}>
      <rect x={x0} y={T} width={SIRKA} height={HLOUBKA} fill="#6b5138" opacity="0.9" />
      {znacky.map(([x, y]) => <Vlakno key={`${x}-${y}`} x={x0 + x} y={T + y} />)}
      <g {...koren}>
        {SEMENA.map(([x], i) => <path key={x} d={KORINKY[i]} transform={`translate(${x0 + x} ${T})`} />)}
      </g>
      {kontakty.map(([x, y]) => <Kontakt key={`${x}-${y}`} x={x0 + x} y={T + y} />)}
    </g>
    <path d={`M${x0} ${T} V${B} H${x0 + SIRKA} V${T} Z`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* semena leží NA lůžku: jejich tah se obrysu jen dotkne */}
    {SEMENA.map(([x, r]) => <Seme key={x} x={x0 + x} y={T - 5.2} r={r} />)}
  </g>
)

export const MykorhizaPodOsivem: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 418">
    <defs>
      <clipPath id="mp-rez-l"><rect x={LX} y={T} width={SIRKA} height={HLOUBKA} /></clipPath>
      <clipPath id="mp-rez-r"><rect x={RX} y={T} width={SIRKA} height={HLOUBKA} /></clipPath>
    </defs>

    {/* ── záhlaví řezů ────────────────────────────────────────── */}
    <text className="sv-lbl" x={LX} y="20">Pod osivo</text>
    <text className="sv-lbl" x={LX} y="41">v jednom pásu</text>
    <text className="sv-lbl" x={RX} y="20">Rozptýleno</text>
    <text className="sv-lbl" x={RX} y="41">do 30 cm</text>

    {/* ── společná stupnice ───────────────────────────────────── */}
    <line x1="62" y1={T} x2="62" y2={B} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      {[0, 3, 10, 20, 30].map((h) => <line key={h} x1="56" y1={cm(h)} x2="68" y2={cm(h)} />)}
    </g>
    <text className="sv-val" x="50" y={cm(0) + 5} textAnchor="end">0 cm</text>
    <text className="sv-val" x="50" y={cm(3) + 5} textAnchor="end">3</text>
    <text className="sv-val" x="50" y={cm(10) + 5} textAnchor="end">10</text>
    <text className="sv-val" x="50" y={cm(20) + 5} textAnchor="end">20</text>
    <text className="sv-val" x="50" y={cm(30) + 5} textAnchor="end">30</text>

    {/* ── řezy: vlevo pás pod osivem, vpravo rozptýleno ───────── */}
    <Rez x0={LX} id="mp-rez-l" znacky={PAS} kontakty={PAS_KONTAKTY} />
    <Rez x0={RX} id="mp-rez-r" znacky={ROZPTYL} kontakty={ROZPTYL_KONTAKTY} />

    {/* Pointa kresby (9.2 p. 3) je jedna: přípravek leží ≈ 3 cm pod osivem.
        Kóta 0–3 cm u pravé hrany levého řezu (styl stupnice) váže hodnotu
        k levému pásu, ne k mezeře mezi řezy. */}
    <line x1={LX + SIRKA + 8} y1={cm(0)} x2={LX + SIRKA + 8} y2={cm(3)} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1={LX + SIRKA + 3} y1={cm(0)} x2={LX + SIRKA + 13} y2={cm(0)} />
      <line x1={LX + SIRKA + 3} y1={cm(3)} x2={LX + SIRKA + 13} y2={cm(3)} />
    </g>
    <text className="sv-val" x={LX + SIRKA + 20} y={cm(1.5) + 10} style={{ fontSize: 24 }}>≈ 3 cm</text>
    <text className="sv-lbl" x={LX + SIRKA + 20} y={cm(1.5) + 32}>pod</text>
    <text className="sv-lbl" x={LX + SIRKA + 20} y={cm(1.5) + 53}>osivem</text>

    {/* ── výsledek pod řezy ───────────────────────────────────── */}
    <text className="sv-val" x={LX} y={B + 28}>celá dávka</text>
    <text className="sv-lbl" x={LX} y={B + 51}>v dosahu kořínků</text>
    <text className="sv-val" x={RX} y={B + 28}>tatáž dávka</text>
    <text className="sv-lbl" x={RX} y={B + 51}>většinou</text>
    <text className="sv-lbl" x={RX} y={B + 72}>mimo dosah</text>

    {/* ── legenda: značky pixelově shodné s řezem (9.2 p. 10) ── */}
    <line x1="30" y1={B + 88} x2="490" y2={B + 88} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <Seme x={36} y={B + 105} r={-12} />
    <text className="sv-val" x="50" y={B + 110}>osivo</text>
    <Vyrez x={114} y={B + 96} />
    <Vlakno x={119.5} y={B + 105.5} />
    <text className="sv-val" x="148" y={B + 110}>přípravek</text>
    <Vyrez x={252} y={B + 96} />
    <path d={`M265 ${B + 99} C 264 ${B + 103}, 266 ${B + 106}, 265 ${B + 109}`} {...koren} />
    <text className="sv-val" x="286" y={B + 110}>kořínek</text>
    <Kontakt x={376} y={B + 104} />
    <text className="sv-val" x="388" y={B + 110}>kontakt</text>
  </svg>
)
