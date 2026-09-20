import React from 'react'

/**
 * Mykorhizní vlákna (DESIGN.md 9.2) — řez půdou: dosah samotného kořene
 * vs. dosah se sítí houby. Kružnice dosahů jsou oříznuté hmotou půdy
 * (dosah je pod zemí), popisky stojí vpravo na kanvasu jako u ostatních
 * řezů článku. Kořen i vlákna leží na ornici — na světlém podkladu by
 * #d8c9b4 nebyl vidět. Statická kresba, id s prefixem `mv-`.
 */
export const MykorhizniVlakna: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 520">
    <defs>
      <clipPath id="mv-rez"><rect x="40" y="150" width="260" height="270" /></clipPath>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: houba sahá dál než kořen. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Dál než kořen</text>

    {/* ── řez půdou ──────────────────────────────────────────── */}
    <g clipPath="url(#mv-rez)">
      <rect x="40" y="150" width="260" height="270" fill="#6b5138" opacity="0.9" />

      {/* dosahy: malý = kořen, velký = síť houby (pod zemí, ořez řezem) */}
      <circle cx="170" cy="256" r="66" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
      <circle cx="170" cy="266" r="128" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />

      <g transform="translate(-20 0)">
        {/* kořen */}
        <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <path d="M190 150 C 188 188, 192 226, 190 262 C 189 286, 191 304, 190 318" />
          <path d="M190 182 C 178 192, 170 200, 164 212 M190 208 C 202 218, 210 226, 216 238 M190 246 C 180 256, 174 264, 170 274 M190 282 C 200 292, 206 300, 210 310" />
        </g>

        {/* síť houby: navazuje na kořen a jde za malý dosah */}
        <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
          <path d="M164 212 C 138 218, 116 216, 92 224 C 80 228, 72 234, 64 242" />
          <path d="M116 217 C 108 204, 100 194, 90 184" />
          <path d="M216 238 C 246 238, 268 232, 290 238 C 302 242, 312 248, 320 256" />
          <path d="M268 234 C 278 222, 286 212, 300 204" />
          <path d="M170 274 C 148 288, 130 306, 114 328 M130 306 C 118 312, 108 316, 98 318" />
          <path d="M210 310 C 230 322, 248 336, 262 358 M248 336 C 258 340, 268 342, 278 342" />
          <path d="M190 318 C 186 342, 180 360, 170 380" />
        </g>

        {/* živiny: v dosahu houby, mimo dosah kořene */}
        <g fill="#54402c">
          <circle cx="72" cy="238" r="2.6" />
          <circle cx="316" cy="252" r="2.6" />
          <circle cx="110" cy="332" r="2.6" />
          <circle cx="266" cy="362" r="2.6" />
          <circle cx="294" cy="200" r="2.6" />
        </g>
      </g>
    </g>

    {/* drn a rostlina nad řezem */}
    <rect x="40" y="136" width="260" height="14" fill="#3f7d4e" />
    <path d="M40 150 H300" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path
      d="M52 137q-1 -7 -3 -11M70 137q2 -6 5 -10M92 137q0 -8 0 -12M116 137q2 -8 4 -13M142 137q-2 -6 -4 -9M198 137q-2 -7 -4 -11M222 137q1 -6 3 -10M246 137q0 -8 0 -12M270 137q2 -7 4 -11M290 137q-2 -6 -3 -9"
      fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round"
    />
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      <path d="M170 136 q-4 -16 -11 -24 M170 136 q5 -14 12 -21" />
    </g>
    <path d="M40 136 V420 H300 V136" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── popisky vpravo ─────────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="300" y1="210" x2="318" y2="210" />
      <line x1="300" y1="300" x2="318" y2="300" />
    </g>
    <text className="sv-val" x="326" y="204">dosah</text>
    <text className="sv-lbl" x="326" y="226">samotného</text>
    <text className="sv-lbl" x="326" y="246">kořene</text>

    <text className="sv-val" x="326" y="290">dosah se</text>
    <text className="sv-val" x="326" y="316">sítí houby</text>
    <text className="sv-lbl" x="326" y="338">živiny na okraji</text>
    <text className="sv-lbl" x="326" y="358">jsou mimo dosah</text>
    <text className="sv-lbl" x="326" y="378">kořene</text>

    {/* ── legenda ────────────────────────────────────────────── */}
    <line x1="30" y1="444" x2="490" y2="444" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="466">Co je co</text>
    <path d="M32 480 C 31 487, 33 493, 32 498" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    <text className="sv-val" x="48" y="493">kořen</text>
    <path d="M160 486 C 170 482, 180 484, 190 480" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    <text className="sv-val" x="202" y="493">vlákna houby</text>
    <circle cx="368" cy="488" r="2.6" fill="#54402c" />
    <text className="sv-val" x="384" y="493">živiny</text>
  </svg>
)
