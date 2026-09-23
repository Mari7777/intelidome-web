import React from 'react'

/**
 * Míchání od hloubky k povrchu (DESIGN.md 9.2) — tři průchody na místě:
 * nejprve zemina s pískem v celých 30 cm, potom zeolit do 15 cm, nakonec
 * biochar a Actino do horních 10 cm. Profil je v každém kroku celý (práce
 * na místě, ne stavba po patrech); přibývá jen příměs ve své hloubce.
 * Vzory příměsí jsou tytéž jako v kresbě tří zón (9.2 p. 10), spodní hrana
 * příměsi se vytrácí jako tam — hranice zón nejsou řez nožem.
 *
 * Portrétová sazba 520 px, id s prefixem `mh-`. Měřítko 30 cm = 120 px.
 * Popisky kroků stojí NAD řezem přes celou šířku: vlevo od řezu by se
 * na telefonu (18 px v jednotkách viewBoxu) nevešly. Statická kresba.
 */

const X = 40
const SIRKA = 330
const HLOUBKA = 120

const Defs: React.FC = () => (
  <defs>
    <pattern id="mh-plna" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M4 6 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <path d="M20 22 l5 -2 2 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <circle cx="21" cy="8" r="2.6" fill="#54402c" />
      <circle cx="8" cy="22" r="2.2" fill="#54402c" />
      <path d="M13 13 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    </pattern>
    <pattern id="mh-zeolit" width="34" height="26" patternUnits="userSpaceOnUse">
      <path d="M6 8 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      <path d="M23 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    </pattern>
    <linearGradient id="mh-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <mask id="mh-mask" maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill="url(#mh-fade)" />
    </mask>
  </defs>
)

/** Příměs v pásmu `od`–`az` cm; spodní hrana přesahuje o 6 px a vytrácí se
 *  přes hranici zóny (jako `tz-m1` v kresbě tří zón). */
const Primes: React.FC<{ y0: number; od: number; az: number; vzor: string }> = ({ y0, od, az, vzor }) => (
  <rect x={X} y={y0 + od * 4} width={SIRKA} height={(az - od) * 4 + 6} fill={`url(#${vzor})`} mask="url(#mh-mask)" />
)

/** Jeden průchod: řez 0–30 cm a hloubka, do které tento krok míchá. */
const Krok: React.FC<{ y0: number; krok: 1 | 2 | 3 }> = ({ y0, krok }) => {
  const hloubka = krok === 1 ? 30 : krok === 2 ? 15 : 10
  const yH = y0 + hloubka * 4
  return (
    <g>
      <rect x={X} y={y0} width={SIRKA} height={HLOUBKA} fill="#6b5138" opacity="0.9" />
      {krok === 2 ? <Primes y0={y0} od={0} az={15} vzor="mh-zeolit" /> : null}
      {krok === 3 ? <Primes y0={y0} od={10} az={15} vzor="mh-zeolit" /> : null}
      {krok === 3 ? <Primes y0={y0} od={0} az={10} vzor="mh-plna" /> : null}
      <path d={`M${X} ${y0} H${X + SIRKA} V${y0 + HLOUBKA} H${X} Z`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
      {krok > 1 ? (
        <line x1={X} y1={yH} x2={X + SIRKA} y2={yH} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      ) : null}
      <line x1={X + SIRKA} y1={yH} x2={X + SIRKA + 18} y2={yH} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <text className="sv-val" x={X + SIRKA + 26} y={yH + 5}>do {hloubka} cm</text>
    </g>
  )
}

export const MichaniOdHloubky: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 716">
    <Defs />
    {/* Pointa kresby (9.2 p. 3): hloubky tří průchodů — věta by jen zdvojila H3 vedle. */}
    <text className="sv-val" x="40" y="40" style={{ fontSize: 24 }}>30 → 15 → 10 cm</text>

    <text className="sv-lbl" x="40" y="92">1 · Zemina a písek</text>
    <Krok y0={104} krok={1} />

    <text className="sv-lbl" x="40" y="272">2 · Zeolit</text>
    <Krok y0={284} krok={2} />

    <text className="sv-lbl" x="40" y="452">3 · Biochar a Actino</text>
    <Krok y0={464} krok={3} />

    <text className="sv-lbl" x="40" y="620">Potom už nefrézovat do hloubky,</text>
    <text className="sv-lbl" x="40" y="640">příměsi by se rozešly do 30 cm</text>

    {/* ── legenda: značky pixelově shodné se vzory v patternech (9.2 p. 10) ── */}
    <line x1="30" y1="664" x2="490" y2="664" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="30" y="684" width="14" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <text className="sv-val" x="52" y="696">základ</text>
    <path d="M142 692 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
    <text className="sv-val" x="160" y="696">biochar</text>
    <circle cx="266" cy="692" r="2.6" fill="#54402c" />
    <text className="sv-val" x="278" y="696">Actino</text>
    <path d="M372 690 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    <text className="sv-val" x="392" y="696">zeolit</text>
  </svg>
)
