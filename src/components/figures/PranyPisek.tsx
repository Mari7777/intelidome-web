import React from 'react'

/**
 * Praný vs. nepraný písek (DESIGN.md 9.2) — o výsledku rozhodují mezery.
 * Oba trsy mají zrna uložená stejně, liší se jen tím, co vězí v mezerách.
 * Vlevo nepraný: prach a jíl vyplnily mezery a kapka zůstala nad zrny.
 * Vpravo praný: mezery zůstaly volné a čárkovaná cesta vody se proplétá
 * MEZI zrny (od obrysu zrna volno nejméně 5 jednotek), kapka leží
 * v póru mezi zrny D a E.
 * Tečky prachu leží jen v mezerách, žádná nezasahuje do zrna.
 *
 * Značky vody jsou společné sérii: cesta #2563eb 1,6 čárky 3 7, kapka
 * A 7 7, šipka l8 10 8 -10 op .75 (jako `dve-zahrady`, `pisek-pod-koreny`).
 * Zrno: výplň #c2a052 fillOpacity .55, obrys plný #232830 1,6 (9.2 p. 9).
 * Portrétová sazba 520 × 700, trs 212 × 268. Legenda: kroužek r 16,6 =
 * malá zrna trsu (F, L), tečka a kapka jsou tytéž tvary jako v trsech
 * (9.2 p. 10). Statická kresba, bez id.
 */

/** Zrna trsu [cx, cy, r] po řadách: A B C / D E F / G H I / J K L;
 *  F a L jsou malá zrna na pravém okraji. */
const ZRNA: [number, number, number][] = [
  [31.2, 33.3, 30.2], [99.8, 29.1, 29.1], [176.8, 35.4, 31.2], // A B C
  [54.1, 101.9, 31.2], [141.4, 104, 29.1], [195.5, 101.9, 16.6], // D E F
  [29.1, 170.6, 29.1], [104, 172.6, 31.2], [178.9, 168.5, 30.2], // G H I
  [62.4, 237.1, 30.2], [143.5, 239.2, 29.1], [195.5, 230.9, 16.6], // J K L
]

/** Prach a jíl v mezerách nepraného trsu; tečka má od obrysu zrna volno
 *  nejméně 1,6 jednotky, žádná neleží v zrnu. */
const PRACH: [number, number][] = [
  [67.6, 44.7], [130, 48.9], [133.1, 40.6], [139.4, 47.8], [140.4, 37.4], [62.4, 51], [66.6, 60.3], [71.8, 53], [78, 58.2], [129, 59.3],
  [136.2, 55.1], [147.7, 57.2], [45.8, 65.5], [57.2, 65.5], [72.8, 66.6], [81.1, 65.5], [84.2, 72.8], [93.6, 71.8], [108.2, 69.7], [117.5, 71.8],
  [118.6, 62.4], [125.8, 67.6], [137.3, 63.4], [142.5, 69.7], [150.8, 66.6], [157, 71.8], [169.5, 71.8], [187.2, 72.8], [99.8, 86.3], [110.2, 81.1],
  [163.3, 77], [170.6, 81.1], [177.8, 75.9], [178.9, 84.2], [186.2, 81.1], [91.5, 91.5], [107.1, 93.6], [174.7, 92.6], [90.5, 104], [98.8, 99.8],
  [103, 107.1], [91.5, 118.6], [96.7, 112.3], [104, 122.7], [175.8, 112.3], [184.1, 121.7], [72.8, 136.2], [81.1, 132.1], [88.4, 129], [95.7, 125.8],
  [103, 131], [113.4, 125.8], [114.4, 134.2], [124.8, 134.2], [161.2, 136.2], [165.4, 129], [172.6, 133.1], [176.8, 124.8], [187.2, 133.1], [42.6, 138.3],
  [49.9, 142.5], [58.2, 143.5], [66.6, 143.5], [78, 143.5], [85.3, 139.4], [124.8, 142.5], [132.1, 139.4], [137.3, 145.6], [141.4, 138.3], [148.7, 143.5],
  [59.3, 152.9], [63.4, 160.2], [68.6, 152.9], [136.2, 155], [143.5, 158.1], [67.6, 167.4], [140.4, 167.4], [63.4, 174.7], [141.4, 175.8], [143.5, 184.1],
  [55.1, 193.4], [61.4, 187.2], [64.5, 194.5], [69.7, 187.2], [71.8, 197.6], [133.1, 197.6], [136.2, 190.3], [143.5, 194.5], [157, 196.6], [45.8, 203.8],
  [59.3, 201.8], [79, 201.8], [84.2, 208], [93.6, 210.1], [109.2, 209], [117.5, 209], [125.8, 208], [134.2, 205.9], [146.6, 201.8], [160.2, 205.9],
  [168.5, 209], [182, 204.9], [189.3, 208], [96.7, 218.4], [104, 215.3], [111.3, 219.4], [173.7, 219.4], [178.9, 212.2], [99.8, 233], [108.2, 226.7],
  [108.2, 235],
]

/** Cesta vody praným trsem: prochází hrdly B–C, B–E, D–E (pór s kapkou),
 *  E–H, H–I, H–K a J–K; tečna v každém hrdle kolmá na spojnici středů. */
const CESTA =
  'M138.3 -35.4 C138.3 -11 139.3 8 137.3 32.2 C136.1 46 132.6 59.9 120.6 66.6 C107.3 73.9 98.8 87.7 98.8 103 ' +
  'C98.8 118.1 109.9 130 123.2 137.3 C135.3 143.8 141.2 156.8 142 170.6 C142.8 185.1 136.8 199.6 124.3 207 ' +
  'C112.6 213.8 103.5 224.6 103.5 238.2 V272.5'

/** Zrno písku: průhledná je jen výplň, obrys zůstává plným inkoustem. */
const ZRNO = { fill: '#c2a052', fillOpacity: 0.55, stroke: '#232830', strokeWidth: 1.6 } as const
const PRASEK = { fill: '#6b5138', opacity: 0.9 } as const

const Zrna: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} {...ZRNO}>
    {ZRNA.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} />
    ))}
  </g>
)

const Prach: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} {...PRASEK}>
    {PRACH.map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="2.6" />
    ))}
  </g>
)

const Kapka: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M${x} ${y} C ${x + 4} ${y + 6}, ${x + 7} ${y + 10}, ${x + 7} ${y + 14} A 7 7 0 0 1 ${x - 7} ${y + 14} C ${x - 7} ${y + 10}, ${x - 4} ${y + 6}, ${x} ${y}`}
    fill="#2563eb"
    opacity="0.9"
  />
)

/** Levá hrana levého a pravého sloupce (trs i popisky) a horní hrana trsů. */
const LEVY = 40
const PRAVY = 284
const TRS_Y = 150

export const PranyPisek: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 700">
    {/* Pointa kresby (9.2 p. 3) je jedna: rozhodují mezery. */}
    <text className="sv-val" x="40" y="40" style={{ fontSize: 24 }}>Rozhodují mezery</text>

    {/* ── vlevo: nepraný ─────────────────────────────────────── */}
    <text className="sv-lbl" x={LEVY} y="96">Nepraný</text>
    {/* kapka stojí nad ucpaným hrdlem B–C, kudy vpravo voda vstupuje */}
    <Kapka x={LEVY + 138.3} y={TRS_Y - 27} />
    <Zrna x={LEVY} y={TRS_Y} />
    <Prach x={LEVY} y={TRS_Y} />
    <text className="sv-lbl" x={LEVY} y="472">prach a jíl</text>
    <text className="sv-lbl" x={LEVY} y="496">vyplní mezery –</text>
    <text className="sv-lbl" x={LEVY} y="520">voda hůř projde,</text>
    <text className="sv-lbl" x={LEVY} y="544">vzduchu je méně</text>

    {/* ── vpravo: praný ──────────────────────────────────────── */}
    <text className="sv-lbl" x={PRAVY} y="96">Praný</text>
    <Zrna x={PRAVY} y={TRS_Y} />
    <g transform={`translate(${PRAVY} ${TRS_Y})`}>
      <path d={CESTA} fill="none" stroke="#2563eb" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      {/* kapka v póru mezi zrny D a E, na cestě */}
      <Kapka x={98.8} y={87.9} />
      <path d="M95.5 277.7 l8 10 8 -10" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </g>
    <text className="sv-lbl" x={PRAVY} y="472">mezery volné –</text>
    <text className="sv-lbl" x={PRAVY} y="496">voda projde</text>
    <text className="sv-lbl" x={PRAVY} y="520">a vzduch se vrátí</text>
    <text className="sv-lbl" x={PRAVY} y="544">ke kořenům</text>

    {/* ── legenda ────────────────────────────────────────────── */}
    <line x1="30" y1="572" x2="490" y2="572" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="598">Co je co</text>
    <circle cx="46" cy="630" r="16.6" {...ZRNO} />
    <text className="sv-val" x="72" y="636">zrno písku</text>
    <circle cx="214" cy="630" r="2.6" {...PRASEK} />
    <text className="sv-val" x="228" y="636">prach a jíl</text>
    <Kapka x={378} y={619} />
    <text className="sv-val" x="394" y="636">voda</text>
    <text className="sv-lbl" x="30" y="680">Praním jemných částic ubývá</text>
  </svg>
)
