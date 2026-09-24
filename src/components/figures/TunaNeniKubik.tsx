import React from 'react'

/**
 * Tuna není kubík (DESIGN.md 9.2) — vodorovné pruhy říkají, kolik místa
 * zabere jedna tuna každého materiálu (modelové sypné hustoty z článku).
 * Měřítko je společné: 1 m³ = 66 px, biochar s 5 m³ vyplní celou osu.
 * Statická kresba — pointa je délka pruhu, žádný pohyb by ji nezpřesnil.
 *
 * Portrétová sazba 520 px, id s prefixem `tk-`. Výplně nesou barvy hmot
 * z palety, každá hmota má uzavřený obrys #232830 (9.2 p. 9).
 */

const PRUHY: { nazev: string; m3: number; popisek: string; fill: string; opacity?: number }[] = [
  { nazev: 'Písek', m3: 0.67, popisek: '0,67 m³', fill: '#c2a052', opacity: 0.55 },
  { nazev: 'Zemina', m3: 0.71, popisek: '0,71 m³', fill: '#6b5138', opacity: 0.9 },
  { nazev: 'Zeolit', m3: 1.25, popisek: '1,25 m³', fill: '#d5d3cc' },
  { nazev: 'Actino', m3: 1.67, popisek: '1,67 m³', fill: '#54402c', opacity: 0.85 },
  { nazev: 'Biochar', m3: 5, popisek: '5 m³', fill: '#12161b', opacity: 0.9 },
]

const X0 = 140 // začátek osy pruhů; vlevo od ní jména materiálů
const KROK = 66 // px na 1 m³
const RADEK = 64
const Y0 = 96
const VYSKA = 30

export const TunaNeniKubik: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 500">
    <text className="sv-lbl" x="40" y="34">Kolik místa zabere jedna tuna</text>
    <text className="sv-lbl" x="40" y="54">při modelové sypné hustotě</text>

    {/* mřížka: 1–5 m³ */}
    {[1, 2, 3, 4, 5].map((m) => (
      <g key={m}>
        <line
          x1={X0 + m * KROK}
          y1={Y0 - 16}
          x2={X0 + m * KROK}
          y2={Y0 + (PRUHY.length - 1) * RADEK + VYSKA + 16}
          stroke="#d5d3cc"
          strokeWidth="1.6"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />
        <text
          className="sv-lbl"
          x={X0 + m * KROK}
          y={Y0 + (PRUHY.length - 1) * RADEK + VYSKA + 40}
          textAnchor="middle"
        >
          {m}
        </text>
      </g>
    ))}
    {/* Jednotka je hodnota, ne kategorie — sv-lbl by ji verzálkovalo na
       fyzikálně chybné „M³" (M = mega). Stejný důvod platí pro popisky
       pruhů níž (kolo 02, styl). */}
    <text
      className="sv-val"
      x={X0 + 5 * KROK + 16}
      y={Y0 + (PRUHY.length - 1) * RADEK + VYSKA + 40}
    >
      m³
    </text>

    {PRUHY.map((p, i) => {
      const y = Y0 + i * RADEK
      const sirka = p.m3 * KROK
      const posledni = i === PRUHY.length - 1
      return (
        <g key={p.nazev}>
          <text className="sv-val" x={X0 - 16} y={y + VYSKA - 9} textAnchor="end">{p.nazev}</text>
          <rect x={X0} y={y} width={sirka} height={VYSKA} fill={p.fill} opacity={p.opacity ?? 1} />
          <path
            d={`M${X0} ${y} H${X0 + sirka} V${y + VYSKA} H${X0} Z`}
            fill="none"
            stroke="#232830"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Pointa kresby (9.2 p. 3) je jedna: tuna biocharu = 5 m³.
             Text na tmavém pruhu nese --id-ink-dark (bílá), ne hex natvrdo
             mimo tokeny (#f4f1ea nebyl v paletě — kolo 02, styl). */}
          <text
            className="sv-val"
            x={posledni ? X0 + sirka - 12 : X0 + sirka + 10}
            y={y + VYSKA - 8}
            textAnchor={posledni ? 'end' : 'start'}
            style={posledni ? { fontSize: 24, fill: 'var(--id-ink-dark)' } : undefined}
          >
            {p.popisek}
          </text>
        </g>
      )
    })}

    <text className="sv-lbl" x="40" y="452">Objemem se určuje poměr směsi,</text>
    <text className="sv-lbl" x="40" y="472">hmotností objednávka a doprava</text>
  </svg>
)
