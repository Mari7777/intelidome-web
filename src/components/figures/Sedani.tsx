import React from 'react'

/**
 * Sedání půdy (DESIGN.md 9.2) — tři fáze téhož řezu pod sebou.
 * 1. Čerstvě zpracováno: rovný povrch přesně na cílové rovině, ale mezi
 *    částicemi spousta umělého vzduchu (husté prázdné kroužky).
 * 2. Po dešti: směs si sedla, uprostřed prohlubeň s loužičkou, kroužků je
 *    málo — a povrch je pod cílovou rovinou. Kapky deště jsou jediný akcent
 *    a jediná smyčka (CSS `fall`).
 * 3. Doplněno a ustáleno: prohlubeň dosypaná směsí, povrch zpět na rovině,
 *    póry rovnoměrné — teprve teď se sejí.
 *
 * Portrétová sazba 520 px, id s prefixem `sd-`. Klidový stav v markupu:
 * kapky viditelné nad prohlubní, louže i doplněk nakreslené.
 */
export const Sedani: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 480">
    <defs>
      <pattern id="sd-vzduch-hodne" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="3" fill="none" stroke="rgba(255,255,255,.36)" strokeWidth="1" />
        <circle cx="13" cy="12" r="2.2" fill="none" stroke="rgba(255,255,255,.36)" strokeWidth="1" />
      </pattern>
      <pattern id="sd-vzduch-malo" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="9" r="2.2" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
        <circle cx="22" cy="22" r="1.8" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
      </pattern>
      <pattern id="sd-vzduch-akorat" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="6" r="2.4" fill="none" stroke="rgba(255,255,255,.34)" strokeWidth="1" />
        <circle cx="16" cy="15" r="1.6" fill="#2563eb" opacity="0.8" />
      </pattern>
      <radialGradient id="sd-louze" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.08" />
      </radialGradient>
      <clipPath id="sd-c1"><path d="M40 62 H480 V140 H40 Z" /></clipPath>
      <clipPath id="sd-c2"><path d="M40 208 C 120 208, 170 206, 210 220 C 240 232, 280 232, 310 220 C 350 206, 400 208, 480 208 V286 H40 Z" /></clipPath>
      <clipPath id="sd-c3"><path d="M40 354 H480 V432 H40 Z" /></clipPath>
    </defs>

    {/* ── 1. čerstvě zpracováno ───────────────────────────────── */}
    <text className="sv-lbl" x="40" y="30">1 · Čerstvě zpracováno</text>
    <text className="sv-val" x="480" y="31" textAnchor="end">láká k výsevu</text>
    <g clipPath="url(#sd-c1)">
      <rect x="40" y="62" width="440" height="78" fill="#6b5138" opacity="0.9" />
      <rect x="40" y="62" width="440" height="78" fill="url(#sd-vzduch-hodne)" />
    </g>
    <path d="M40 62 H480" stroke="#232830" strokeWidth="1.6" fill="none" />
    <path d="M40 62 V140 H480 V62" stroke="#232830" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    {/* cílová rovina */}
    <line x1="30" y1="62" x2="490" y2="62" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="480" y="126" textAnchor="end" style={{ fill: '#d8c9b4' }}>hodně vzduchu</text>

    {/* ── 2. po dešti ─────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="176">2 · Po dešti si sedá</text>
    <text className="sv-val" x="480" y="177" textAnchor="end">prohlubně a louže</text>
    <g clipPath="url(#sd-c2)">
      <rect x="40" y="200" width="440" height="86" fill="#6b5138" opacity="0.9" />
      <rect x="40" y="200" width="440" height="86" fill="url(#sd-vzduch-malo)" />
    </g>
    {/* louže v prohlubni */}
    <ellipse cx="260" cy="228" rx="52" ry="7" fill="url(#sd-louze)" stroke="#60a5fa" strokeWidth="1.4" />
    <path d="M40 208 C 120 208, 170 206, 210 220 C 240 232, 280 232, 310 220 C 350 206, 400 208, 480 208" fill="none" stroke="#232830" strokeWidth="1.6" />
    <path d="M40 208 V286 H480 V208" stroke="#232830" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    {/* cílová rovina — povrch je pod ní */}
    <line x1="30" y1="200" x2="490" y2="200" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    {/* kapky deště */}
    <g fill="#3b82f6" opacity="0.85">
      <g className="sd-kapka"><ellipse cx="228" cy="164" rx="2.6" ry="4.5" /></g>
      <g className="sd-kapka" style={{ animationDelay: '0.9s' }}><ellipse cx="262" cy="158" rx="2.6" ry="4.5" /></g>
      <g className="sd-kapka" style={{ animationDelay: '1.7s' }}><ellipse cx="296" cy="166" rx="2.6" ry="4.5" /></g>
    </g>
    <text className="sv-lbl" x="480" y="272" textAnchor="end" style={{ fill: '#d8c9b4' }}>málo vzduchu</text>

    {/* ── 3. doplněno a ustáleno ──────────────────────────────── */}
    <text className="sv-lbl" x="40" y="322">3 · Doplněno, ustáleno</text>
    <text className="sv-val" x="480" y="323" textAnchor="end">teprve teď sít</text>
    <g clipPath="url(#sd-c3)">
      <rect x="40" y="354" width="440" height="78" fill="#6b5138" opacity="0.9" />
      <rect x="40" y="354" width="440" height="78" fill="url(#sd-vzduch-akorat)" />
      {/* doplněk správnou směsí — světlejší tón, stejné póry */}
      <path d="M170 354 C 210 354, 240 372, 260 374 C 280 372, 310 354, 350 354 Z" fill="#8a6b4a" opacity="0.9" />
    </g>
    <path d="M40 354 H480" stroke="#232830" strokeWidth="1.6" fill="none" />
    <path d="M40 354 V432 H480 V354" stroke="#232830" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    <line x1="30" y1="354" x2="490" y2="354" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    {/* drobné výhonky = výsev */}
    <g stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M80 354 v-8 M83 354 q2 -6 6 -8 M150 354 v-7 M230 354 q-2 -6 -6 -8 M233 354 v-9 M320 354 v-8 M400 354 q2 -6 6 -8 M403 354 v-7 M460 354 v-8" />
    </g>
    <text className="sv-lbl" x="480" y="418" textAnchor="end" style={{ fill: '#d8c9b4' }}>póry akorát</text>

    {/* ── pointa ──────────────────────────────────────────────── */}
    <line x1="30" y1="452" x2="490" y2="452" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="474">Čerstvá zemina lže</text>
    <text className="sv-val" x="490" y="475" textAnchor="end">sedá týdny, ne dny</text>
  </svg>
)
