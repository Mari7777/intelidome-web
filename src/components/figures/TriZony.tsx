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
 * Portrétová sazba 520 px (viewBox 0 60 520 452 — nad drnem nic není),
 * popisky vpravo mají 204 px, aby se vešly i po mobilním zvětšení (15/18
 * při měřítku 0,71). Id s prefixem `tz-`. Klidový stav v markupu: kapka ve
 * třetí zóně, všechny příměsi na svém místě.
 */
export const TriZony: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 60 520 452">
    <defs>
      {/* biochar = černé střípky, Actino = tmavě hnědé hrudky, zeolit = světlá hranatá zrna */}
      <pattern id="tz-plna" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M4 6 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
        <path d="M20 22 l5 -2 2 4 -4 3 z" fill="#12161b" opacity="0.9" />
        <circle cx="21" cy="8" r="2.6" fill="#54402c" />
        <circle cx="8" cy="22" r="2.2" fill="#54402c" />
        <path d="M13 13 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#5b5e63" strokeWidth="1.5" />
      </pattern>
      <pattern id="tz-zeolit" width="34" height="26" patternUnits="userSpaceOnUse">
        <path d="M6 8 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#5b5e63" strokeWidth="1.5" />
        <path d="M23 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#5b5e63" strokeWidth="1.5" />
      </pattern>
      {/* vytrácení příměsí u spodní hrany zóny */}
      <linearGradient id="tz-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="tz-m1"><rect x="80" y="110" width="210" height="92" fill="url(#tz-fade)" /></mask>
      <mask id="tz-m2"><rect x="80" y="190" width="210" height="52" fill="url(#tz-fade)" /></mask>
      <clipPath id="tz-rez"><rect x="80" y="110" width="210" height="240" /></clipPath>
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
    <text className="sv-val" x="50" y="355" textAnchor="end">30</text>
    <text className="sv-lbl" x="50" y="92" textAnchor="end">cm</text>

    {/* ── řez ─────────────────────────────────────────────────── */}
    <g clipPath="url(#tz-rez)">
      <rect x="80" y="110" width="210" height="240" fill="#6b5138" opacity="0.9" />
      {/* zóna 1: plná výbava, vytrácí se k 10–12 cm */}
      <rect x="80" y="110" width="210" height="92" fill="url(#tz-plna)" mask="url(#tz-m1)" />
      {/* zóna 2: jen zeolit, vytrácí se k 15–16 cm */}
      <rect x="80" y="190" width="210" height="52" fill="url(#tz-zeolit)" mask="url(#tz-m2)" />

      {/* kořeny: husté nahoře, řidší dole */}
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M112 110 C 110 140, 114 170, 112 200 C 111 230, 114 260, 112 290" />
        <path d="M112 124 C 102 134, 96 142, 92 152 M112 146 C 122 156, 128 162, 132 172 M112 176 C 104 186, 100 194, 98 204 M112 240 C 120 250, 124 258, 126 268" />
        <path d="M160 110 C 164 140, 158 170, 162 200 C 164 224, 160 246, 162 262" />
        <path d="M160 120 C 170 128, 176 136, 180 146 M161 152 C 152 162, 148 170, 146 180 M162 190 C 170 200, 174 208, 176 218" />
        <path d="M210 110 C 208 140, 212 170, 210 200 C 209 226, 212 250, 210 276" />
        <path d="M210 128 C 200 138, 194 146, 190 156 M210 158 C 220 168, 226 174, 230 184 M210 214 C 202 224, 198 232, 196 242" />
        <path d="M258 110 C 260 136, 256 160, 259 186 C 260 204, 258 218, 259 232" />
        <path d="M258 122 C 268 130, 274 138, 278 148 M259 156 C 250 166, 246 174, 244 184" />
      </g>

      {/* kapka: projde všemi třemi zónami */}
      <g className="tz-kapka">
        <path d="M185 112 C 189 118, 192 122, 192 126 A 7 7 0 0 1 178 126 C 178 122, 181 118, 185 112 Z" fill="#2563eb" opacity="0.9" />
      </g>
    </g>
    <rect x="80" y="96" width="210" height="14" fill="#3f7d4e" />
    <path d="M80 110 H290" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path
      d="M88 97q-1 -8 -3 -13M102 97q2 -7 5 -12M116 97q0 -9 0 -14M130 97q2 -10 5 -16M144 97q2 -5 5 -8M158 97q-1 -6 -4 -10M172 97q-2 -10 -5 -17M186 97q-2 -6 -5 -11M200 97q1 -5 2 -8M214 97q1 -10 4 -16M228 97q-2 -9 -5 -15M242 97q0 -8 0 -13M256 97q2 -6 5 -9M270 97q1 -5 3 -8M284 97q-2 -6 -5 -9"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M80 96 V350 H290 V96" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── popisky zón vpravo (204 px) ─────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="290" y1="150" x2="308" y2="150" />
      <line x1="290" y1="210" x2="308" y2="210" />
      <line x1="290" y1="290" x2="308" y2="290" />
    </g>
    <text className="sv-val" x="316" y="130" style={{ fontSize: 24 }}>0–10 cm</text>
    <text className="sv-lbl" x="316" y="150">základ + biochar</text>
    <text className="sv-lbl" x="316" y="170">+ Actino + zeolit</text>
    <text className="sv-lbl" x="316" y="190">nejvíc kořenů</text>

    <text className="sv-val" x="316" y="216" style={{ fontSize: 24 }}>10–15 cm</text>
    <text className="sv-lbl" x="316" y="236">základ + zeolit</text>
    <text className="sv-lbl" x="316" y="256">přechod</text>

    <text className="sv-val" x="316" y="288" style={{ fontSize: 24 }}>15–30 cm</text>
    <text className="sv-lbl" x="316" y="308">jen základ</text>
    <text className="sv-lbl" x="316" y="328">rezervoár vody</text>
    <text className="sv-lbl" x="316" y="348">a vzduchu</text>

    {/* ── legenda — dva řádky (3 + 2). V jednom řádku na 460 px seděla kapka
        „vody" 3 px za slovem „základ" a na mobilu (popisek 18 px) ho
        překrývala — porota kola 04, potvrzeno pixelově. ─────────────── */}
    <line x1="30" y1="372" x2="490" y2="372" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="394">Co je co</text>

    <path d="M32 412 l7 -4 4 5 -5 4 z" fill="#12161b" />
    <text className="sv-val" x="52" y="420">biochar</text>
    <circle cx="198" cy="416" r="4" fill="#54402c" />
    <text className="sv-val" x="210" y="420">Actino</text>
    <path d="M338 412 l6 -3 5 4 -1 6 -6 2 -5 -4 z" fill="#d5d3cc" stroke="#5b5e63" strokeWidth="1.5" />
    <text className="sv-val" x="358" y="420">zeolit</text>

    <rect x="30" y="439" width="14" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <text className="sv-val" x="52" y="450">základ</text>
    <path d="M198 439 C 201 443, 203 446, 203 448.5 A 5 5 0 0 1 193 448.5 C 193 446, 195 443, 198 439 Z" fill="#2563eb" opacity="0.9" />
    <text className="sv-val" x="210" y="450">voda</text>

    <text className="sv-lbl" x="30" y="482">Základ = vaše zemina,</text>
    <text className="sv-lbl" x="30" y="502">případně její směs s pískem</text>
  </svg>
)
