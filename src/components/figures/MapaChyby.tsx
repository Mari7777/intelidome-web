import React from 'react'

/**
 * Mapa chyby (DESIGN.md 9.2) — pohled shora na trávník se třemi různými
 * tvary téhož problému: pravidelné rovnoběžné pruhy řídkého porostu,
 * oválná prohlubeň se stojící vodou a poškození přesně v otočce trasy
 * sekačky. Každý tvar vypráví jiný příběh, proto se vyplatí podívat se na
 * něj dřív, než se něco koupí.
 *
 * Pointa je jedna: tvar a poloha problému napoví příčinu. Jediný akcent je
 * modrá voda v prohlubni (radiální nádech vodního tintu, ne plná akcentní
 * plocha); řídká a poškozená místa nesou radiální nádech sucha #c2a052
 * (9.2), stopa sekačky jsou dvě souběžné stopy kol v otočce, prohlubeň
 * hlubší zelenou #2e6440 (kontrola článků 3. 10. 2026). Popisky stojí pod trávníkem na krému
 * a ke svému tvaru vedou krátkou konstrukční linkou — žádný text přes
 * zelenou plochu.
 *
 * Portrétová sazba 520 px, id s prefixem `mc-` (kresba žádná id nepotřebuje).
 * Statická kresba — čte se tvar, ne děj.
 */
export const MapaChyby: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 300">
    <defs>
      <radialGradient id="mc-sucho" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#c2a052" stopOpacity="0.95" />
        <stop offset="1" stopColor="#c2a052" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="mc-voda" cx="0.5" cy="0.45" r="0.55">
        <stop offset="0" stopColor="#60a5fa" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#3b82f6" stopOpacity="0.55" />
        <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
      </radialGradient>
    </defs>
    {/* Pointa kresby (9.2 p. 3) je jedna: tvar problému napoví příčinu. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Tvar napoví</text>

    {/* ── trávník shora ───────────────────────────────────────── */}
    <rect x="40" y="58" width="440" height="142" fill="#3f7d4e" />

    {/* 1 — pravidelné rovnoběžné pruhy řídkého porostu */}
    <g fill="url(#mc-sucho)">
      <rect x="61" y="66" width="16" height="126" />
      <rect x="83" y="66" width="16" height="126" />
      <rect x="105" y="66" width="16" height="126" />
      <rect x="127" y="66" width="16" height="126" />
      <rect x="149" y="66" width="16" height="126" />
    </g>

    {/* 2 — prohlubeň plná vody */}
    <ellipse cx="260" cy="129" rx="58" ry="40" fill="#2e6440" />
    <ellipse cx="260" cy="129" rx="42" ry="27" fill="url(#mc-voda)" />

    {/* 3 — trasa sekačky s otočkou, poškození přesně v otočce */}
    <g fill="none" stroke="#c2a052" strokeWidth="4" strokeLinecap="round" opacity="0.95">
      <path d="M386 136 V142 a21 21 0 0 0 42 0 V136" />
      <path d="M376 136 V142 a31 31 0 0 0 62 0 V136" />
    </g>
    <path d="M381 58 V142 a26 26 0 0 0 52 0 V58" fill="none" stroke="#232830" strokeWidth="1.6" strokeDasharray="6 6" strokeLinecap="round" />

    <rect x="40" y="58" width="440" height="142" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── vodicí linky k tvarům ───────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="113" y1="190" x2="113" y2="216" />
      <line x1="260" y1="173" x2="260" y2="216" />
      <line x1="407" y1="178" x2="407" y2="216" />
    </g>

    {/* ── popisky pod trávníkem ───────────────────────────────── */}
    <text className="sv-val" x="113" y="238" textAnchor="middle">pruhy</text>
    <text className="sv-lbl" x="113" y="259" textAnchor="middle">výsev nebo</text>
    <text className="sv-lbl" x="113" y="280" textAnchor="middle">postřik</text>

    <text className="sv-val" x="260" y="238" textAnchor="middle">louže</text>
    <text className="sv-lbl" x="260" y="259" textAnchor="middle">prohlubeň</text>

    <text className="sv-val" x="407" y="238" textAnchor="middle">stopa</text>
    <text className="sv-lbl" x="407" y="259" textAnchor="middle">trasa</text>
    <text className="sv-lbl" x="407" y="280" textAnchor="middle">sekačky</text>
  </svg>
)
