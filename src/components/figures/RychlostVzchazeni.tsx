import React from 'react'

/**
 * Rychlost vzcházení (DESIGN.md 9.2) — směs nevzchází naráz. Časová osa
 * 0–28 dnů od výsevu, 13 jednotek na den pro všechny pruhy (den 0 = x 60).
 * Čtyři trávy seřazené od nejrychlejší: jílek vytrvalý 5–8 dnů, kostřava
 * rákosovitá 14–21, kostřava červená 15–20, lipnice luční 21–28. Jediná
 * pointa: svislá linka dne 7 protíná jen pruh jílku — zelené špičky po
 * prvním týdnu jsou hlavně jílek, ostatní semena ještě čekají v zemi.
 *
 * Linka dne 7 začíná až pod názvem jílku, aby neprocházela textem. Pruhy
 * jsou v barvě trávy; voda v kresbě není, modrá tedy také ne. Portrétová
 * sazba 520 px, id s prefixem `vz-` (kresba žádné nepotřebuje). Statická
 * kresba — pointa je poloha pruhů vůči jedné lince.
 */
export const RychlostVzchazeni: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 420">
    {/* Pointa kresby (9.2 p. 3) je jedna: po týdnu je vidět jen jílek. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Po týdnu jen jílek</text>

    {/* ── pruhy: 13 jednotek na den, den 0 = x 60 ─────────────── */}
    {/* jílek vytrvalý, 5–8 dnů */}
    <text className="sv-val" x="125" y="94">jílek vytrvalý</text>
    <rect x="125" y="110" width="39" height="12" rx="3" fill="#3f7d4e" />
    <text className="sv-val" x="172" y="121">5–8</text>

    {/* kostřava rákosovitá, 14–21 dnů */}
    <text className="sv-val" x="242" y="158">kostřava rákosovitá</text>
    <rect x="242" y="174" width="91" height="12" rx="3" fill="#3f7d4e" />
    <text className="sv-val" x="341" y="185">14–21</text>

    {/* kostřava červená, 15–20 dnů */}
    <text className="sv-val" x="255" y="220">kostřava červená</text>
    <rect x="255" y="236" width="65" height="12" rx="3" fill="#3f7d4e" />
    <text className="sv-val" x="328" y="247">15–20</text>

    {/* lipnice luční, 21–28 dnů */}
    <text className="sv-val" x="333" y="282">lipnice luční</text>
    <rect x="333" y="298" width="91" height="12" rx="3" fill="#3f7d4e" />
    <text className="sv-val" x="432" y="309">21–28</text>

    {/* ── den 7: protíná jen pruh jílku ───────────────────────── */}
    <line x1="151" y1="106" x2="151" y2="324" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="163" y="160">den 7</text>

    {/* ── časová osa ──────────────────────────────────────────── */}
    <line x1="60" y1="332" x2="424" y2="332" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="60" y1="326" x2="60" y2="338" />
      <line x1="151" y1="326" x2="151" y2="338" />
      <line x1="242" y1="326" x2="242" y2="338" />
      <line x1="333" y1="326" x2="333" y2="338" />
      <line x1="424" y1="326" x2="424" y2="338" />
    </g>
    <text className="sv-val" x="60" y="364" textAnchor="middle">0</text>
    <text className="sv-val" x="151" y="364" textAnchor="middle">7</text>
    <text className="sv-val" x="242" y="364" textAnchor="middle">14</text>
    <text className="sv-val" x="333" y="364" textAnchor="middle">21</text>
    <text className="sv-val" x="424" y="364" textAnchor="middle">28</text>
    <text className="sv-lbl" x="60" y="394">dnů od výsevu</text>
  </svg>
)
