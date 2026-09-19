import React from 'react'

/**
 * Tři zahrady, tři dávky (DESIGN.md 9.2) — skupinové sloupce ukazují
 * objemové podíly příměsí ze tří modelových receptur článku. Společné
 * měřítko 1 % = 26 px; pointa je 8 % zeolitu v chudém písku. Statická
 * kresba, hodnoty nese výška sloupců. Id s prefixem `tg-`.
 *
 * Barvy hmot jsou tytéž jako značky v ostatních kresbách článku
 * (biochar #12161b, Biovin #54402c, zeolit #d5d3cc s obrysem) a legenda
 * nese stejné výplně (9.2 p. 10, úroveň 2).
 */

const SKUPINY: { nazev: string; hodnoty: [number, number, number] }[] = [
  { nazev: 'Jíl', hodnoty: [2, 2, 2.5] },
  { nazev: 'Hlína', hodnoty: [3, 3, 0] },
  { nazev: 'Písek', hodnoty: [8, 5, 5] },
]

const MATERIALY = [
  { fill: '#d5d3cc', opacity: 1 }, // zeolit
  { fill: '#12161b', opacity: 0.9 }, // biochar
  { fill: '#54402c', opacity: 0.85 }, // Biovin
]

const BASE = 356
const NA_PROCENTO = 26
const SIRKA = 30
const MEZERA = 10
const SKUPINA_X = [86, 218, 350]

const fmt = (v: number) => String(v).replace('.', ',')

export const TriZahrady: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 512">
    <text className="sv-lbl" x="40" y="34">Objemové podíly tří receptur</text>
    <text className="sv-lbl" x="40" y="54">zeolit 0–15 cm · biochar a Biovin 0–10 cm</text>

    {/* mřížka 2–8 % */}
    {[2, 4, 6, 8].map((m) => (
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
        <text className="sv-lbl" x="56" y={BASE - m * NA_PROCENTO + 4} textAnchor="end">
          {m === 8 ? '8 %' : m}
        </text>
      </g>
    ))}
    {/* základna */}
    <line x1="64" y1={BASE} x2="480" y2={BASE} stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />

    {SKUPINY.map((skupina, si) => (
      <g key={skupina.nazev}>
        {skupina.hodnoty.map((hodnota, mi) => {
          const x = SKUPINA_X[si] + mi * (SIRKA + MEZERA)
          const vyska = hodnota * NA_PROCENTO
          const y = BASE - vyska
          const pointa = si === 2 && mi === 0
          if (hodnota === 0) {
            return (
              <g key={mi}>
                <line x1={x + 2} y1={BASE - 2} x2={x + SIRKA - 2} y2={BASE - 2} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
                <text className="sv-lbl" x={x + SIRKA / 2} y={BASE - 10} textAnchor="middle">0</text>
              </g>
            )
          }
          return (
            <g key={mi}>
              <rect x={x} y={y} width={SIRKA} height={vyska} fill={MATERIALY[mi].fill} opacity={MATERIALY[mi].opacity} />
              <path d={`M${x} ${BASE} V${y} H${x + SIRKA} V${BASE}`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
              {/* Pointa kresby (9.2 p. 3) je jedna: 8 % zeolitu v písku. */}
              <text
                className={pointa ? 'sv-val' : 'sv-lbl'}
                x={x + SIRKA / 2}
                y={y - (pointa ? 12 : 8)}
                textAnchor="middle"
                style={pointa ? { fontSize: 24 } : undefined}
              >
                {pointa ? '8 %' : fmt(hodnota)}
              </text>
            </g>
          )
        })}
        <text className="sv-val" x={SKUPINA_X[si] + (3 * SIRKA + 2 * MEZERA) / 2} y={BASE + 28} textAnchor="middle">
          {skupina.nazev}
        </text>
      </g>
    ))}

    {/* ── legenda: tytéž výplně jako sloupce ─────────────────── */}
    <line x1="30" y1="408" x2="490" y2="408" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="30" y="428" width="14" height="14" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="54" y="440">zeolit</text>
    <rect x="176" y="428" width="14" height="14" fill="#12161b" opacity="0.9" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="200" y="440">biochar</text>
    <rect x="342" y="428" width="14" height="14" fill="#54402c" opacity="0.85" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="366" y="440">Biovin</text>
    <text className="sv-lbl" x="30" y="472">Zbytek objemu vždy doplní</text>
    <text className="sv-lbl" x="30" y="492">minerální základ</text>
  </svg>
)
