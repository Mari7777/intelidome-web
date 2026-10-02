import React from 'react'

/**
 * První seč (DESIGN.md 9.2) — tráva dorostla přibližně do 8 cm, první
 * sečení ji zkrátí zhruba na 6 cm. Hlavní panel je porost na nízkém řezu
 * půdou se stupnicí výšky 0 / 6 / 8 cm (25 jednotek = 1 cm); část stébel
 * nad linkou řezu je kreslená světle a čárkovaně, to je to, co odpadne.
 *
 * Pointa je jedna: 8 cm → 6 cm. Menší panel ukazuje totéž pravidlo na
 * přerostlém porostu: nejvýš třetina naráz, tedy 12 → 8 → 6 cm ve dvou
 * sečeních (10 jednotek = 1 cm, všechny tři sloupce v jednom měřítku).
 * Dole tři podmínky, kdy sekat; zaškrtnutí je jen obrys, ne stavová zelená.
 *
 * Kresba je bez vody, a tedy bez modré. Portrétová sazba 520 px, id
 * s prefixem `ps-`. Statická kresba — výšky se čtou ze stupnice, pohyb
 * nože by je nezpřesnil.
 */
export const PrvniSec: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 674">
    <defs>
      {/* pod linkou řezu (6 cm = y 130) zůstává, nad ní odpadne */}
      <clipPath id="ps-zustane"><rect x="90" y="130" width="220" height="152" /></clipPath>
      <clipPath id="ps-odpadne"><rect x="90" y="70" width="220" height="60" /></clipPath>
      {/* porost: nejvyšší stébla končí v 8 cm (y 80), nižší pod linkou řezu */}
      <g id="ps-stebla">
        <path d="M112 280 q-2 -110 -9 -198 M112 280 q2 -80 6 -140" />
        <path d="M128 280 q1 -120 5 -200 M128 280 q-2 -70 -5 -128" />
        <path d="M144 280 q-2 -100 -7 -190 M144 280 q2 -90 5 -172" />
        <path d="M160 280 q2 -115 8 -199 M160 280 q-1 -60 -4 -118" />
        <path d="M176 280 q-1 -120 -6 -196 M176 280 q2 -85 6 -150" />
        <path d="M192 280 q2 -110 7 -200 M192 280 q-2 -75 -5 -138" />
        <path d="M208 280 q-2 -105 -8 -192 M208 280 q1 -95 5 -178" />
        <path d="M224 280 q1 -118 6 -198 M224 280 q-2 -65 -5 -124" />
        <path d="M240 280 q-2 -112 -7 -200 M240 280 q2 -88 6 -160" />
        <path d="M256 280 q2 -108 8 -194 M256 280 q-1 -72 -5 -132" />
        <path d="M272 280 q-1 -116 -6 -199 M272 280 q2 -92 6 -170" />
        <path d="M288 280 q1 -110 5 -195 M288 280 q-2 -68 -5 -122" />
      </g>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: z osmi centimetrů na šest. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>8 cm → 6 cm</text>

    {/* ── stupnice výšky: 25 jednotek = 1 cm ──────────────────── */}
    <line x1="84" y1="80" x2="84" y2="280" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="78" y1="80" x2="90" y2="80" />
      <line x1="78" y1="130" x2="90" y2="130" />
      <line x1="78" y1="280" x2="90" y2="280" />
    </g>
    <text className="sv-val" x="70" y="85" textAnchor="end">8 cm</text>
    <text className="sv-val" x="70" y="135" textAnchor="end">6</text>
    <text className="sv-val" x="70" y="285" textAnchor="end">0</text>

    {/* ── řez půdou a porost ──────────────────────────────────── */}
    <rect x="100" y="280" width="200" height="24" fill="#6b5138" opacity="0.9" />
    {/* odstřižená část nad 6 cm: světlejší a čárkovaná */}
    <g clipPath="url(#ps-odpadne)" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 5" opacity="0.5">
      <use href="#ps-stebla" />
    </g>
    <g clipPath="url(#ps-zustane)" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      <use href="#ps-stebla" />
    </g>
    <path d="M100 280 V304 H300 V280 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* výška před sečením a linka řezu */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="96" y1="80" x2="314" y2="80" />
      <line x1="96" y1="130" x2="314" y2="130" />
    </g>
    <text className="sv-val" x="322" y="85">8 cm</text>
    <text className="sv-lbl" x="322" y="106">první sečení</text>
    <text className="sv-val" x="322" y="151">6 cm</text>
    <text className="sv-lbl" x="322" y="172">po sečení</text>

    {/* ── přerostlý porost: 10 jednotek = 1 cm, základna y 486 ── */}
    <text className="sv-lbl" x="40" y="344">příklad: přerostlý porost</text>

    <rect x="40" y="486" width="44" height="12" fill="#6b5138" opacity="0.9" />
    <rect x="238" y="486" width="44" height="12" fill="#6b5138" opacity="0.9" />
    <rect x="436" y="486" width="44" height="12" fill="#6b5138" opacity="0.9" />
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      {/* 12 cm: přerostlá, nestejně vysoká stébla */}
      <path d="M47 486 q-1 -60 -3 -112 M55 486 q1 -65 3 -120 M63 486 q-1 -55 -2 -104 M70 486 q1 -62 2 -120 M77 486 q0 -58 3 -110" />
      {/* 8 cm: po prvním sečení rovná hrana */}
      <path d="M245 486 q-1 -40 -3 -80 M253 486 q1 -40 1 -80 M261 486 q0 -40 1 -80 M268 486 q1 -40 2 -80 M275 486 q0 -40 3 -80" />
      {/* 6 cm: po druhém sečení */}
      <path d="M443 486 q-1 -30 -3 -60 M451 486 q1 -30 1 -60 M459 486 q0 -30 1 -60 M466 486 q1 -30 2 -60 M473 486 q0 -30 3 -60" />
    </g>
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M40 486 V498 H84 V486 Z" />
      <path d="M238 486 V498 H282 V486 Z" />
      <path d="M436 486 V498 H480 V486 Z" />
    </g>

    {/* šipky mezi sečeními */}
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M106 452 H216 M209 446 l7 6 l-7 6" />
      <path d="M304 452 H414 M407 446 l7 6 l-7 6" />
    </g>
    <text className="sv-lbl" x="161" y="436" textAnchor="middle">1. sečení</text>
    <text className="sv-lbl" x="359" y="436" textAnchor="middle">2. sečení</text>

    <text className="sv-val" x="62" y="524" textAnchor="middle">12 cm</text>
    <text className="sv-val" x="260" y="524" textAnchor="middle">8 cm</text>
    <text className="sv-val" x="458" y="524" textAnchor="middle">6 cm</text>
    <text className="sv-val" x="40" y="552">nejvýš třetina naráz</text>

    {/* ── kdy sekat ───────────────────────────────────────────── */}
    <line x1="40" y1="574" x2="480" y2="574" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M41 596 l5 6 l9 -12" />
      <path d="M41 622 l5 6 l9 -12" />
      <path d="M41 648 l5 6 l9 -12" />
    </g>
    <text className="sv-val" x="64" y="602">rostliny drží v půdě</text>
    <text className="sv-val" x="64" y="628">povrch unese sekačku</text>
    <text className="sv-val" x="64" y="654">suché listy, ostrý nůž</text>
  </svg>
)
