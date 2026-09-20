import React from 'react'

/**
 * Tři zahrady, rozsahy dávek (DESIGN.md 9.2) — skupinové sloupce
 * ukazují dolní a horní objemový podíl každé příměsi. Plná výplň
 * sahá k dolní hranici, světlejší část pokračuje k horní hranici.
 * Společné měřítko 1 % = 22 px; zbytek vždy doplní minerální základ.
 *
 * Barvy hmot jsou tytéž jako značky v ostatních kresbách článku
 * (biochar #12161b, Biovin #54402c, zeolit #d5d3cc s obrysem) a legenda
 * nese stejné výplně (9.2 p. 10, úroveň 2).
 */

type Rozsah = [number, number]

const SKUPINY: { nazev: string; hodnoty: [Rozsah, Rozsah, Rozsah] }[] = [
  { nazev: 'Jíl', hodnoty: [[2, 5], [2, 5], [2.5, 5]] },
  { nazev: 'Hlína', hodnoty: [[3, 7], [3, 7], [0, 0]] },
  { nazev: 'Písek', hodnoty: [[8, 10], [5, 10], [5, 10]] },
]

const MATERIALY = [
  { fill: '#d5d3cc', opacity: 1 }, // zeolit
  { fill: '#12161b', opacity: 0.9 }, // biochar
  { fill: '#54402c', opacity: 0.85 }, // Biovin
]

const BASE = 356
const NA_PROCENTO = 22
const SIRKA = 30
const MEZERA = 10
const SKUPINA_X = [86, 218, 350]

const fmt = (v: number) => String(v).replace('.', ',')

export const TriZahrady: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 536">
    <text className="sv-lbl" x="40" y="34">Rozsahy objemových podílů v %</text>
    <text className="sv-lbl" x="40" y="54">zeolit 0–15 cm · biochar a Biovin 0–10 cm</text>

    {/* Společná mřížka zahrnuje horní hranici všech rozsahů. */}
    {[2, 4, 6, 8, 10].map((m) => (
      <g key={m}>
        <line
          x1="64"
          y1={BASE - m * NA_PROCENTO}
          x2="480"
          y2={BASE - m * NA_PROCENTO}
          stroke="#d5d3cc"
          strokeWidth="1.6"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />
        <text className="sv-lbl id-tnum" x="56" y={BASE - m * NA_PROCENTO + 4} textAnchor="end">
          {m}
        </text>
      </g>
    ))}
    <line x1="64" y1={BASE} x2="480" y2={BASE} stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />

    {SKUPINY.map((skupina, si) => (
      <g key={skupina.nazev}>
        {skupina.hodnoty.map(([minimum, maximum], mi) => {
          const x = SKUPINA_X[si] + mi * (SIRKA + MEZERA)
          const horniY = BASE - maximum * NA_PROCENTO
          const dolniY = BASE - minimum * NA_PROCENTO
          // Stupňovité popisky ponechají místo i delšímu rozsahu 2,5–5.
          const popisekY = horniY - 8 - mi * 24
          const hlavniRozsah = si === 2 && mi === 0
          if (maximum === 0) {
            return (
              <g key={mi}>
                <line x1={x + 2} y1={BASE - 2} x2={x + SIRKA - 2} y2={BASE - 2} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
                <text className="sv-lbl id-tnum" x={x + SIRKA / 2} y={BASE - 10} textAnchor="middle">0</text>
              </g>
            )
          }
          return (
            <g key={mi}>
              <rect x={x} y={dolniY} width={SIRKA} height={minimum * NA_PROCENTO} fill={MATERIALY[mi].fill} opacity={MATERIALY[mi].opacity} />
              <rect x={x} y={horniY} width={SIRKA} height={(maximum - minimum) * NA_PROCENTO} fill={MATERIALY[mi].fill} opacity={0.25} />
              <path d={`M${x} ${BASE} V${horniY} H${x + SIRKA} V${BASE}`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
              <line x1={x} y1={dolniY} x2={x + SIRKA} y2={dolniY} stroke="#232830" strokeWidth="1.6" />
              {mi > 0 && (
                <line x1={x + SIRKA / 2} y1={horniY - 3} x2={x + SIRKA / 2} y2={popisekY + 5} stroke="#5b5e63" strokeWidth="1" />
              )}
              {hlavniRozsah && (
                <line x1={x - 8} y1={popisekY + 3} x2={x} y2={horniY} stroke="#5b5e63" strokeWidth="1" />
              )}
              <text
                className={hlavniRozsah ? 'sv-val' : 'sv-lbl id-tnum'}
                style={hlavniRozsah ? { fontSize: 24 } : undefined}
                x={hlavniRozsah ? x - 10 : x + SIRKA / 2}
                y={popisekY}
                textAnchor={hlavniRozsah ? 'end' : 'middle'}
              >
                {fmt(minimum)}–{fmt(maximum)}
              </text>
            </g>
          )
        })}
        <text className="sv-val" x={SKUPINA_X[si] + (3 * SIRKA + 2 * MEZERA) / 2} y={BASE + 28} textAnchor="middle">
          {skupina.nazev}
        </text>
      </g>
    ))}

    <line x1="30" y1="408" x2="490" y2="408" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="30" y="428" width="14" height="14" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="54" y="440">zeolit</text>
    <rect x="176" y="428" width="14" height="14" fill="#12161b" opacity="0.9" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="200" y="440">biochar</text>
    <rect x="342" y="428" width="14" height="14" fill="#54402c" opacity="0.85" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="366" y="440">Biovin</text>
    <text className="sv-lbl" x="30" y="472">Plná výplň: dolní hranice.</text>
    <text className="sv-lbl" x="30" y="492">Světlá část: rozsah k horní hranici.</text>
    <text className="sv-lbl" x="30" y="516">Zbytek doplní minerální základ.</text>
  </svg>
)
