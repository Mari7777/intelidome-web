import React from 'react'

/**
 * Součet vstupů ≠ slehlá směs (DESIGN.md 9.2) — vlevo dva zvlášť
 * odměřené materiály, vpravo táž dvojice po promíchání a slehnutí:
 * jemnější částice zapadly do mezer mezi hrubšími, takže hladina
 * skončí POD čárkovanou linkou prostého součtu. Bez čísel — článek
 * žádnou pevnou přirážku neslibuje. Statická kresba, id `sv-`;
 * každá hmota je popsaná přímo, legenda není potřeba.
 */
export const SlehnutiVstupu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 496">
    <defs>
      <pattern id="sv-jemne" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="7" r="2.4" fill="#c2a052" />
        <circle cx="17" cy="18" r="2" fill="#c2a052" />
      </pattern>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: slehlá směs je pod součtem. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Méně než součet</text>

    {/* ── vlevo: vstupy odměřené zvlášť ──────────────────────── */}
    <text className="sv-lbl" x="40" y="86">Vstupy odměřené zvlášť</text>
    {/* hrubší materiál */}
    <rect x="52" y="210" width="88" height="130" fill="#6b5138" opacity="0.9" />
    <path d="M52 210 H140 V340 H52 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-lbl" x="52" y="366">hrubší</text>
    <text className="sv-lbl" x="52" y="386">materiál</text>
    {/* jemnější materiál */}
    <rect x="168" y="210" width="88" height="130" fill="#c2a052" opacity="0.55" />
    <path d="M168 210 H256 V340 H168 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-lbl" x="168" y="366">jemnější</text>
    <text className="sv-lbl" x="168" y="386">materiál</text>

    {/* ── vpravo: po promíchání a slehnutí ───────────────────── */}
    <text className="sv-lbl" x="316" y="78">Po promíchání</text>
    <text className="sv-lbl" x="316" y="98">a slehnutí</text>
    {/* prostý součet vstupů (konstrukční linka) */}
    <line x1="330" y1="132" x2="470" y2="132" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="330" y="124">součet vstupů</text>
    {/* skutečná hladina směsi níž */}
    <rect x="342" y="158" width="116" height="182" fill="#6b5138" opacity="0.9" />
    <rect x="342" y="158" width="116" height="182" fill="url(#sv-jemne)" />
    <path d="M342 158 H458 V340 H342 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* rozdíl mezi součtem a hladinou */}
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M476 136 V152" />
      <path d="M471 145 l5 8 5 -8" />
    </g>
    <text className="sv-lbl" x="316" y="366">jemné částice</text>
    <text className="sv-lbl" x="316" y="386">zapadly do mezer</text>
    <text className="sv-lbl" x="316" y="406">mezi hrubšími</text>

    <text className="sv-lbl" x="40" y="446">Poměr se odměřuje před promícháním;</text>
    <text className="sv-lbl" x="40" y="466">výslednou výšku ověří realizace</text>
  </svg>
)
