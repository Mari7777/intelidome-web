import React from 'react'

/**
 * Ukládání odspodu (DESIGN.md 9.2) — tři kroky stavby modelového profilu
 * 30 cm pod sebou: nejprve spodních 15 cm minerálního základu, pak 5 cm
 * se zeolitem, nakonec horních 10 cm plné směsi. V každém kroku je nová
 * zóna promíchaná (vzory příměsí jsou tytéž jako v kresbě tří zón),
 * budoucí zóny drží jen čárkovaný obrys. Statická kresba.
 *
 * Portrétová sazba 520 px, id s prefixem `uo-`. Měřítko 30 cm = 120 px
 * (4 px na cm) v každém kroku.
 */

const X = 200 // levý okraj řezu; vlevo popisky kroku
const SIRKA = 220

/** Vzory příměsí — shodné značky jako `tri-zony` (9.2 p. 10). */
const Defs: React.FC = () => (
  <defs>
    <pattern id="uo-plna" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M4 6 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <path d="M20 22 l5 -2 2 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <circle cx="21" cy="8" r="2.6" fill="#54402c" />
      <circle cx="8" cy="22" r="2.2" fill="#54402c" />
      <path d="M13 13 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    </pattern>
    <pattern id="uo-zeolit" width="34" height="26" patternUnits="userSpaceOnUse">
      <path d="M6 8 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      <path d="M23 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    </pattern>
  </defs>
)

/**
 * Jeden krok: `y0` je horní hrana budoucího povrchu (0 cm). Zóny:
 * 0–10 cm (40 px), 10–15 cm (20 px), 15–30 cm (60 px).
 */
const Krok: React.FC<{ y0: number; faze: 1 | 2 | 3 }> = ({ y0, faze }) => {
  const y10 = y0 + 40
  const y15 = y0 + 60
  const y30 = y0 + 120
  return (
    <g>
      {/* spodní zóna: vždy hotová */}
      <rect x={X} y={y15} width={SIRKA} height={60} fill="#6b5138" opacity="0.9" />
      {/* střední zóna se zeolitem */}
      {faze >= 2 ? (
        <g>
          <rect x={X} y={y10} width={SIRKA} height={20} fill="#6b5138" opacity="0.9" />
          <rect x={X} y={y10} width={SIRKA} height={20} fill="url(#uo-zeolit)" />
        </g>
      ) : null}
      {/* horní zóna s plnou směsí */}
      {faze >= 3 ? (
        <g>
          <rect x={X} y={y0} width={SIRKA} height={40} fill="#6b5138" opacity="0.9" />
          <rect x={X} y={y0} width={SIRKA} height={40} fill="url(#uo-plna)" />
        </g>
      ) : null}
      {/* obrys hotové hmoty (9.2 p. 9) + čárkovaný obrys toho, co teprve přijde */}
      {faze === 1 ? (
        <g>
          <path d={`M${X} ${y15} H${X + SIRKA} V${y30} H${X} Z`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
          <path d={`M${X} ${y15} V${y0} H${X + SIRKA} V${y15}`} fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinejoin="round" />
        </g>
      ) : null}
      {faze === 2 ? (
        <g>
          <path d={`M${X} ${y10} H${X + SIRKA} V${y30} H${X} Z`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
          <path d={`M${X} ${y10} V${y0} H${X + SIRKA} V${y10}`} fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinejoin="round" />
        </g>
      ) : null}
      {faze === 3 ? (
        <path d={`M${X} ${y0} H${X + SIRKA} V${y30} H${X} Z`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
      ) : null}
    </g>
  )
}

export const UkladaniOdspodu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 584">
    <Defs />
    {/* Pointa kresby (9.2 p. 3) je jedna: staví se odspodu nahoru. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Odspodu nahoru</text>

    {/* ── krok 1 ─────────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="88">1 · Spodních 15 cm</text>
    <text className="sv-lbl" x="40" y="108">minerální základ</text>
    <Krok y0={72} faze={1} />
    <text className="sv-lbl" x={X + SIRKA + 10} y="168">15–30</text>

    {/* ── krok 2 ─────────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="248">2 · Dalších 5 cm</text>
    <text className="sv-lbl" x="40" y="268">základ + zeolit</text>
    <Krok y0={232} faze={2} />
    <text className="sv-lbl" x={X + SIRKA + 10} y="306">10–15</text>

    {/* ── krok 3 ─────────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="408">3 · Horních 10 cm</text>
    <text className="sv-lbl" x="40" y="428">plná směs</text>
    <Krok y0={392} faze={3} />
    <text className="sv-lbl" x={X + SIRKA + 10} y="418">0–10</text>

    <text className="sv-lbl" x="40" y="546">V každé zóně promíchané —</text>
    <text className="sv-lbl" x="40" y="566">žádná čistá patra</text>
  </svg>
)
