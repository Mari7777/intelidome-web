import React from 'react'

/**
 * Tři zóny profilu (DESIGN.md 9.2) — nese tabulku „hloubka → co tam patří →
 * proč". Řez 30 cm (8 px na cm): 0–10 cm minerální základ s biocharem,
 * Actinem a zeolitem, kde žije nejvíc kořenů; 10–15 cm základ jen se
 * zeolitem jako přechod; 15–30 cm jen základ — rezerva vody a vzduchu.
 * Přechody mezi zónami se vytrácejí (maska), ne řežou — „ne patra dortu".
 * Jediný akcent: kapka vody, která projde všemi třemi zónami (CSS, 5,2 s) —
 * voda a vzduch musí mít volnou cestu.
 *
 * Portrétová sazba 520 px, id s prefixem `tz-`. Klidový stav v markupu:
 * kapka ve třetí zóně, všechny příměsi na svém místě.
 */
export const TriZony: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 540">
    <defs>
      {/* biochar = černé střípky, Actino = tmavě hnědé hrudky, zeolit = světlá hranatá zrna */}
      <pattern id="tz-plna" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M4 6 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
        <path d="M20 22 l5 -2 2 4 -4 3 z" fill="#12161b" opacity="0.9" />
        <circle cx="21" cy="8" r="2.6" fill="#54402c" />
        <circle cx="8" cy="22" r="2.2" fill="#54402c" />
        <path d="M13 13 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#e8e7e3" stroke="#5b5e63" strokeWidth="0.7" />
      </pattern>
      <pattern id="tz-zeolit" width="34" height="26" patternUnits="userSpaceOnUse">
        <path d="M6 8 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#e8e7e3" stroke="#5b5e63" strokeWidth="0.7" />
        <path d="M23 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#e8e7e3" stroke="#5b5e63" strokeWidth="0.7" />
      </pattern>
      {/* vytrácení příměsí u spodní hrany zóny */}
      <linearGradient id="tz-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="tz-m1"><rect x="80" y="110" width="230" height="92" fill="url(#tz-fade)" /></mask>
      <mask id="tz-m2"><rect x="80" y="190" width="230" height="52" fill="url(#tz-fade)" /></mask>
      <clipPath id="tz-rez"><rect x="80" y="110" width="230" height="240" /></clipPath>
    </defs>

    {/* ── metr ────────────────────────────────────────────────── */}
    <line x1="62" y1="110" x2="62" y2="350" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="56" y1="110" x2="68" y2="110" />
      <line x1="56" y1="190" x2="68" y2="190" />
      <line x1="56" y1="230" x2="68" y2="230" />
      <line x1="56" y1="350" x2="68" y2="350" />
    </g>
    <text className="sv-val" x="50" y="115" textAnchor="end">0</text>
    <text className="sv-val" x="50" y="195" textAnchor="end">10</text>
    <text className="sv-val" x="50" y="235" textAnchor="end">15</text>
    <text className="sv-val" x="50" y="355" textAnchor="end">30 cm</text>

    {/* ── řez ─────────────────────────────────────────────────── */}
    <g clipPath="url(#tz-rez)">
      <rect x="80" y="110" width="230" height="240" fill="#6b5138" opacity="0.9" />
      {/* zóna 1: plná výbava, vytrácí se k 10–12 cm */}
      <rect x="80" y="110" width="230" height="92" fill="url(#tz-plna)" mask="url(#tz-m1)" />
      {/* zóna 2: jen zeolit, vytrácí se k 15–16 cm */}
      <rect x="80" y="190" width="230" height="52" fill="url(#tz-zeolit)" mask="url(#tz-m2)" />

      {/* kořeny: husté nahoře, řidší dole */}
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M116 110 C 114 140, 118 170, 116 200 C 115 230, 118 260, 116 290" />
        <path d="M116 124 C 106 134, 100 142, 96 152 M116 146 C 126 156, 132 162, 136 172 M116 176 C 108 186, 104 194, 102 204 M116 240 C 124 250, 128 258, 130 268" />
        <path d="M166 110 C 170 140, 164 170, 168 200 C 170 224, 166 246, 168 262" />
        <path d="M166 120 C 176 128, 182 136, 186 146 M167 152 C 158 162, 154 170, 152 180 M168 190 C 176 200, 180 208, 182 218" />
        <path d="M222 110 C 220 140, 224 170, 222 200 C 221 226, 224 250, 222 276" />
        <path d="M222 128 C 212 138, 206 146, 202 156 M222 158 C 232 168, 238 174, 242 184 M222 214 C 214 224, 210 232, 208 242" />
        <path d="M274 110 C 276 136, 272 160, 275 186 C 276 204, 274 218, 275 232" />
        <path d="M274 122 C 284 130, 290 138, 294 148 M275 156 C 266 166, 262 174, 260 184" />
      </g>

      {/* kapka: projde všemi třemi zónami */}
      <g className="tz-kapka">
        <path d="M195 112 C 199 118, 202 122, 202 126 A 7 7 0 0 1 188 126 C 188 122, 191 118, 195 112 Z" fill="#2563eb" opacity="0.9" />
      </g>
    </g>
    <rect x="80" y="96" width="230" height="14" fill="#3f7d4e" />
    <path d="M80 110 H310" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path
      d="M88 97q-1 -8 -3 -13M102 97q2 -7 5 -12M116 97q0 -9 0 -14M130 97q2 -10 5 -16M144 97q2 -5 5 -8M158 97q-1 -6 -4 -10M172 97q-2 -10 -5 -17M186 97q-2 -6 -5 -11M200 97q1 -5 2 -8M214 97q1 -10 4 -16M228 97q-2 -9 -5 -15M242 97q0 -8 0 -13M256 97q2 -6 5 -9M270 97q1 -5 3 -8M284 97q-2 -6 -5 -9M298 97q-1 -8 -3 -13"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M80 96 V350 H310 V96" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── popisky zón vpravo ──────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="310" y1="150" x2="330" y2="150" />
      <line x1="310" y1="210" x2="330" y2="210" />
      <line x1="310" y1="290" x2="330" y2="290" />
    </g>
    <text className="sv-val" x="338" y="128">0–10 cm</text>
    <text className="sv-lbl" x="338" y="148">základ + biochar</text>
    <text className="sv-lbl" x="338" y="164">+ Actino + zeolit</text>
    <text className="sv-lbl" x="338" y="182" opacity="0.75">nejvíc kořenů</text>

    <text className="sv-val" x="338" y="206">10–15 cm</text>
    <text className="sv-lbl" x="338" y="226">základ + zeolit</text>
    <text className="sv-lbl" x="338" y="244" opacity="0.75">přechod</text>

    <text className="sv-val" x="338" y="286">15–30 cm</text>
    <text className="sv-lbl" x="338" y="306">jen minerální základ</text>
    <text className="sv-lbl" x="338" y="324" opacity="0.75">rezerva: voda, vzduch</text>

    {/* ── legenda ─────────────────────────────────────────────── */}
    <line x1="30" y1="376" x2="490" y2="376" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="400">Co je co</text>

    <path d="M32 418 l7 -4 4 5 -5 4 z" fill="#12161b" />
    <text className="sv-val" x="52" y="426">biochar</text>
    <circle cx="160" cy="422" r="4" fill="#54402c" />
    <text className="sv-val" x="172" y="426">Actino</text>
    <path d="M268 418 l6 -3 5 4 -1 6 -6 2 -5 -4 z" fill="#e8e7e3" stroke="#5b5e63" strokeWidth="0.8" />
    <text className="sv-val" x="288" y="426">zeolit</text>
    <rect x="372" y="415" width="14" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <text className="sv-val" x="394" y="426">základ</text>

    <text className="sv-lbl" x="30" y="458">Minerální základ = vaše zemina,</text>
    <text className="sv-lbl" x="30" y="474">případně její směs s pískem</text>

    <line x1="30" y1="492" x2="490" y2="492" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="516">Přechody navazují</text>
    <text className="sv-val" x="490" y="517" textAnchor="end">ne patra dortu</text>
  </svg>
)
