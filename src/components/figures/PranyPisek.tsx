import React from 'react'

/**
 * Praný vs. neprané zrno (DESIGN.md 9.2) — o výsledku rozhodují mezery.
 * Vlevo nepraný písek: prachové a jílovité částice vyplnily mezery mezi
 * zrny a kapka stojí na povrchu. Vpravo praný: mezery zůstaly volné
 * a kapka má kudy projít (čárkovaná cesta dolů). Statická kresba,
 * id s prefixem `pp2-`; značky zrna / prachu / vody jsou v legendě
 * pixelově shodné s kresbou (9.2 p. 10).
 */

/** Trs zrn písku 3×3 (hexagonální skládání). */
const Zrna: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} fill="#c2a052" opacity="0.55" stroke="#232830" strokeWidth="1.6">
    <circle cx="26" cy="24" r="17" />
    <circle cx="66" cy="20" r="15" />
    <circle cx="106" cy="26" r="17" />
    <circle cx="42" cy="58" r="15" />
    <circle cx="84" cy="56" r="17" />
    <circle cx="124" cy="60" r="14" />
    <circle cx="24" cy="92" r="16" />
    <circle cx="64" cy="94" r="15" />
    <circle cx="104" cy="92" r="16" />
  </g>
)

/** Prach a jíl v mezerách (jen nepraná strana). */
const Prach: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} fill="#6b5138" opacity="0.9">
    {[[46, 22], [88, 36], [24, 44], [64, 40], [108, 44], [46, 76], [88, 74], [124, 80], [30, 70], [70, 22], [104, 70], [56, 60]].map(([cx, cy], i) => (
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

export const PranyPisek: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 508">
    {/* Pointa kresby (9.2 p. 3) je jedna: rozhodují mezery. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Rozhodují mezery</text>

    {/* ── vlevo: nepraný ─────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="86">Nepraný</text>
    <Kapka x={116} y={112} />
    <Zrna x={42} y={150} />
    <Prach x={42} y={150} />
    <text className="sv-lbl" x="40" y="298">prach a jíl ucpou</text>
    <text className="sv-lbl" x="40" y="318">mezery — voda stojí,</text>
    <text className="sv-lbl" x="40" y="338">vzduch se nedostane</text>

    {/* ── vpravo: praný ──────────────────────────────────────── */}
    <text className="sv-lbl" x="300" y="86">Praný</text>
    <Zrna x={312} y={150} />
    {/* volná cesta mezerami dolů */}
    <line x1="386" y1="120" x2="386" y2="268" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <Kapka x={386} y={236} />
    <path d="M378 274 l8 10 8 -10" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    <text className="sv-lbl" x="300" y="318">mezery volné —</text>
    <text className="sv-lbl" x="300" y="338">voda projde</text>
    <text className="sv-lbl" x="300" y="358">a vzduch se vrátí</text>
    <text className="sv-lbl" x="300" y="378">ke kořenům</text>

    {/* ── legenda ────────────────────────────────────────────── */}
    <line x1="30" y1="398" x2="490" y2="398" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="420">Co je co</text>
    <circle cx="40" cy="444" r="16" fill="#c2a052" opacity="0.55" stroke="#232830" strokeWidth="1.6" />
    <text className="sv-val" x="62" y="449">zrno písku</text>
    <circle cx="210" cy="444" r="2.6" fill="#6b5138" opacity="0.9" />
    <text className="sv-val" x="226" y="449">prach a jíl</text>
    <Kapka x={376} y={432} />
    <text className="sv-val" x="392" y="449">voda</text>
    <text className="sv-lbl" x="30" y="490">Praním jemných částic ubývá</text>
  </svg>
)
